import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

import Header from './components/Header';
import RepoInput from './components/RepoInput';
import ErrorAlert from './components/ErrorAlert';
import RepoInfo from './components/RepoInfo';
import VisualizationCanvas from './components/VisualizationCanvas';
import SelectedNodeInfo from './components/SelectedNodeInfo';
import Instructions from './components/Instructions';
import RepoSearch from './components/RepoSearch';
import FilePreview from "./components/FilePreview";

import { visualizeRepo } from './utils/d3Visualizer';

const App = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repoData, setRepoData] = useState(null);
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
    path: "",
    expanded: false
  });

  const getFileColor = (path) => {
    const ext = path.split('.').pop().toLowerCase();
    const colorMap = {
      py: '#3776AB',
      js: '#F7DF1E',
      jsx: '#61DAFB',
      ts: '#3178C6',
      tsx: '#3178C6',
      html: '#E34F26',
      css: '#1572B6',
      scss: '#CC6699',
      json: '#5A5A5A',
      md: '#083FA1',
      txt: '#6B7280',
      yml: '#CB171E',
      yaml: '#CB171E',
      xml: '#0060AC',
      svg: '#FFB13B',
      jpg: '#8B5CF6',
      png: '#8B5CF6',
      gif: '#8B5CF6',
      go: '#00ADD8',
      java: '#B07219',
      cpp: '#F34B7D',
      c: '#A8B9CC',
      rs: '#CE422B',
      php: '#777BB4',
      rb: '#CC342D',
      swift: '#F05138',
      kt: '#A97BFF',
      sh: '#4EAA25',
      sql: '#E38C00',
      r: '#276DC3',
    };
    return colorMap[ext] || '#6B7280'; // Default to gray if unknown
  };

  useEffect(() => {
    if (repoData) visualizeRepo(repoData, svgRef, getFileColor, setSelectedNode, searchTerm, setSelectedFile, setFilePreview);
  }, [repoData, searchTerm]);

  const handleFetchRepo = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    setLoading(true);
    setError('');
    setRepoData(null);
    setSelectedNode(null);

    try {
  setLoading(true);
  const response = await fetch(`http://localhost:5000/api/repo?url=${encodeURIComponent(repoUrl)}`);
  
  // Always check if response.ok
  if (!response.ok) {
    const errData = await response.json();
    console.error("Backend error:", errData);
    setError(errData.error || "Failed to fetch repo");
    return;
  }

  const data = await response.json();
  console.log("Fetched Repo Data:", data); // Should now log the full object
  setRepoData(data);
} catch (err) {
  console.error("Network or parse error:", err);
} finally {
  setLoading(false);
}
  };

  // Fetch raw file content from GitHub
  const fetchFileContent = async (owner, repo, filePath, x, y, expanded = false) => {
    try {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Cannot load file");
      const text = await response.text();

      setFilePreview({
        visible: true,
        content: text,
        path: filePath,
        x,
        y,
        expanded,
      });
    } catch {
      setFilePreview({
        visible: true,
        content: "⚠️ Unable to load file preview.",
        path: filePath,
        x,
        y,
        expanded,
      });
    }
  };

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().duration(300).call(svg.zoom.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().duration(300).call(svg.zoom.scaleBy, 0.7);
  };

  const handleResetZoom = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().duration(500).call(svg.zoom.transform, d3.zoomIdentity);
    visualizeRepo(repoData, svgRef, getFileColor, setSelectedNode);
  };

  const handleDownload = () => {
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repoData?.repo_name || 'repo'}-visualization.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative container mx-auto px-4 py-12">
        <Header />
        <RepoInput
          repoUrl={repoUrl}
          setRepoUrl={setRepoUrl}
          handleFetchRepo={handleFetchRepo}
          loading={loading}
        />
        {error && <ErrorAlert message={error} />}
        {repoData && (
          <>
            <RepoInfo {...{ repoData, handleZoomIn, handleZoomOut, handleResetZoom, handleDownload }} />
            <RepoSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <SelectedNodeInfo selectedNode={selectedNode} getFileColor={getFileColor} />
            <VisualizationCanvas svgRef={svgRef} />
          </>
        )}
        {!repoData && !loading && !error && <Instructions />}

        {filePreview.visible && (
          <FilePreview
            filePreview={filePreview}
            setFilePreview={setFilePreview}
            repoData={repoData}
            fetchFileContent={fetchFileContent}
          />
        )}
      </div>
    </div>
  );
};

export default App;