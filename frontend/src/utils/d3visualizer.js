import * as d3 from "d3";

export const visualizeRepo = (
  data,
  svgRef,
  getFileColor,
  setSelectedNode,
  searchTerm = "",
  setSelectedFile = null,
  setFilePreview
) => {
  if (!svgRef || !svgRef.current) return;

  // Clear previous visualization
  d3.select(svgRef.current).selectAll("*").remove();

  const width = svgRef.current.clientWidth || 800;
  const height = svgRef.current.clientHeight || 600;

  const svg = d3.select(svgRef.current)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");

  // Define defs for glow and gradient
  const defs = svg.append("defs");

  // Glow filter
  const filter = defs.append("filter").attr("id", "glow");
  filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // Gradient for root
  const gradient = defs.append("radialGradient").attr("id", "rootGradient");
  gradient.append("stop").attr("offset", "0%").attr("stop-color", "#6366F1").attr("stop-opacity", 1);
  gradient.append("stop").attr("offset", "100%").attr("stop-color", "#4F46E5").attr("stop-opacity", 1);

  const g = svg.append("g");

  // Zoom
  const zoom = d3.zoom()
    .scaleExtent([0.1, 8])
    .on("zoom", (event) => g.attr("transform", event.transform));
  svg.call(zoom);
  svg.zoom = zoom;

  // Build tree structure
  const root = { name: data.repo_name, children: [], isRoot: true };
  const pathMap = { "": root };

  data.structure.forEach((item) => {
    const parts = item.path.split("/");
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const previousPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!pathMap[currentPath]) {
        const node = {
          name: part,
          fullPath: currentPath,
          type: i === parts.length - 1 ? item.type : "dir",
        };
        if (!pathMap[previousPath].children) pathMap[previousPath].children = [];
        pathMap[previousPath].children.push(node);
        pathMap[currentPath] = node;
      }
    }
  });

  const hierarchy = d3.hierarchy(root);
  const radius = Math.min(width, height) / 2 - 150;

  const tree = d3.tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

  const treeData = tree(hierarchy);

  g.attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Links
  const link = g.selectAll(".link")
    .data(treeData.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkRadial().angle(d => d.x).radius(d => d.y))
    .attr("fill", "none")
    .attr("stroke", d => d.target.data.type === "dir" ? "#4B5563" : getFileColor(d.target.data.name))
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.4);

  // Nodes
  const node = g.selectAll(".node")
    .data(treeData.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`)
    .style("cursor", "pointer");

  // Circles
  node.append("circle")
    .attr("r", d => d.data.isRoot ? 14 : d.data.type === "dir" ? 8 : 5)
    .attr("fill", d => {
      if (searchTerm && d.data.fullPath && d.data.fullPath.toLowerCase().includes(searchTerm.toLowerCase())) 
        return "orange";
      if (d.data.isRoot) return "url(#rootGradient)";
      return d.data.type === "dir" ? "#374151" : getFileColor(d.data.name);
    })
    .attr("stroke", d => d.data.isRoot ? "#818CF8" : d.data.type === "dir" ? "#6B7280" : getFileColor(d.data.name))
    .attr("stroke-width", d => d.data.isRoot ? 2 : 1.5)
    .attr("stroke-opacity", 0.8)
    .style("filter", "url(#glow)")

    // Hover logic for preview
    .on("mouseenter", async function(event, d) {
      if (d.data.type !== "file" || !setFilePreview) return;

      // Highlight node and links
      d3.select(this)
        .transition().duration(300)
        .attr("r", 8)
        .attr("stroke-width", 2.5)
        .attr("stroke-opacity", 1);

      link.transition()
        .duration(300)
        .attr("stroke-opacity", l => l.source === d || l.target === d ? 0.8 : 0.15)
        .attr("stroke-width", l => l.source === d || l.target === d ? 2.5 : 1.5);

      setSelectedNode(d.data);

      // Only show preview for files
      const owner = data.owner;
      const repo = data.repo_name;
      const branch = data.default_branch || "main";
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${d.data.fullPath}`;


      const gNode = d3.select(this).node();
      const pt = svg.node().createSVGPoint();
      pt.x = 0; 
      pt.y = 0;
      const { x: screenX, y: screenY } = pt.matrixTransform(gNode.getScreenCTM());
      //Set file preview
      setFilePreview({
        visible: true,
        x: screenX + 10,
        y: screenY - 20,
        content: previewText,
        path: d.data.fullPath,
        expanded: false,
        rawUrl // optional, store for later click
      });

      try {
        const res = await fetch(rawUrl);
        if (!res.ok) throw new Error("Failed to fetch");
        const text = await res.text();
        const previewText = text.split("\n").slice(0, 20).join("\n");

        setFilePreview(prev => ({ ...prev, content: previewText }));
      } catch (err) {
        console.error("Preview fetch failed:", err);
        setFilePreview(prev => ({ ...prev, content: "Failed to load preview" }));
      }
    })

    // Click logic → show full content (scrollable)
    .on("click", async function(event, d) {
      if (d.data.type !== "file" || !setFilePreview) return;

      const owner = data.owner;
      const repo = data.repo_name;
      const branch = data.default_branch || "main";
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${d.data.fullPath}`;

      setFilePreview(prev => ({
        ...prev,
        visible: true,
        expanded: true,
        x: event.pageX + 10,
        y: event.pageY - 20,
        content: "Loading..."
      }));

      try {
        const res = await fetch(rawUrl);
        const text = await res.text();
        setFilePreview(prev => ({ ...prev, content: text }));
      } catch (err) {
        console.error("Full preview fetch failed:", err);
        setFilePreview(prev => ({ ...prev, content: "Failed to load file" }));
      }
    });


  // Labels
  node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => (d.x < Math.PI === !d.children ? 7 : -7))
    .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
    .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
    .text(d => d.data.name)
    .attr("fill", "#E5E7EB")
    .attr("font-size", d => d.data.isRoot ? "13px" : "10px")
    .attr("font-weight", d => d.data.isRoot ? "600" : "400")
    .style("pointer-events", "none")
    .style("user-select", "none")
    .style("opacity", 0.9);

  // Click for file preview
  node.on("click", function(event, d) {
    if (!d.children && setSelectedFile) {
      setSelectedFile(d.data);
    }
  });

  // Auto center & scale
  const bounds = g.node().getBBox();
  const fullWidth = bounds.width;
  const fullHeight = bounds.height;
  const midX = bounds.x + fullWidth / 2;
  const midY = bounds.y + fullHeight / 2;

  if (fullWidth > 0 && fullHeight > 0) {
    const scale = 0.8 / Math.max(fullWidth / width, fullHeight / height);
    const translate = [width / 2 - scale * midX, height / 2 - scale * midY];
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }
};