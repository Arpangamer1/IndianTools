import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_TOOL } from '../data/tools';
import ToolPageLayout from '../components/layout/ToolPageLayout';
import ToolWidget from '../components/tools/ToolWidget';
import NotFound from './NotFound';

export default function ToolPage() {
  const { slug } = useParams();
  const tool = GET_TOOL(slug);

  useEffect(() => {
    if (tool) {
      document.title = tool.seoTitle || `${tool.name} — Free Online Tool | IndianTools`;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', tool.seoDescription);
      }
    }
  }, [tool]);

  if (!tool) {
    return <NotFound />;
  }

  return (
    <ToolPageLayout tool={tool}>
      <ToolWidget tool={tool} />
    </ToolPageLayout>
  );
}
