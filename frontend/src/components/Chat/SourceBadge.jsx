import React from 'react';

export default function SourceBadge({ href, label }) {
  return <a href={href} className="text-sm text-blue-600">{label}</a>;
}
