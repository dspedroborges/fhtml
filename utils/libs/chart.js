const chart = {
  bar({ labels = [], data = [] }) {
    if (!labels.length || labels.length !== data.length) return "";

    const width = 600;
    const height = 400;

    const pad = 50;
    const maxY = Math.max(...data);
    const barWidth = (width - pad * 2) / data.length;
    const scaleY = v => height - pad - (v / (maxY || 1)) * (height - pad * 2);

    let svg = `
      <svg
        viewBox="0 0 ${width} ${height}"
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
    `;

    svg += `
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="black"/>
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="black"/>
    `;

    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const val = (maxY / steps) * i;
      const yPos = scaleY(val);
      svg += `
        <line x1="${pad - 5}" y1="${yPos}" x2="${pad}" y2="${yPos}" stroke="black"/>
        <text x="${pad - 8}" y="${yPos + 4}" font-size="12" text-anchor="end">
          ${val.toFixed(0)}
        </text>
      `;
    }

    labels.forEach((label, i) => {
      const barHeight = (data[i] / (maxY || 1)) * (height - pad * 2);
      const yPos = height - pad - barHeight;
      const xPos = pad + i * barWidth;

      svg += `
        <rect x="${xPos}" y="${yPos}" width="${barWidth - 4}" height="${barHeight}" fill="steelblue"/>
        <text x="${xPos + barWidth / 2}" y="${height - pad + 18}" font-size="12" text-anchor="middle">
          ${label}
        </text>
      `;
    });

    svg += `</svg>`;
    return svg;
  },

line({ labels = [], data = [] }) {
  if (!labels.length || !Array.isArray(data) || !data.length) return "";

  const datasets = Array.isArray(data[0]) ? data : [data];
  const length = labels.length;

  if (!datasets.every(arr => Array.isArray(arr) && arr.length === length)) return "";

  const width = 600;
  const height = 400;
  const pad = 50;

  const flat = datasets.flat();
  const maxY = Math.max(...flat);
  const stepX = length > 1 ? (width - pad * 2) / (length - 1) : 0;
  const scaleY = v => height - pad - (v / (maxY || 1)) * (height - pad * 2);

  const colors = ["steelblue", "tomato", "seagreen", "orange", "purple", "brown"];

  let svg = `
    <svg
      viewBox="0 0 ${width} ${height}"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
  `;

  svg += `
    <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="black"/>
    <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="black"/>
  `;

  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const val = (maxY / steps) * i;
    const yPos = scaleY(val);

    svg += `
      <line x1="${pad - 5}" y1="${yPos}" x2="${pad}" y2="${yPos}" stroke="black"/>
      <line x1="${pad}" y1="${yPos}" x2="${width - pad}" y2="${yPos}" stroke="#ddd"/>
      <text x="${pad - 8}" y="${yPos + 4}" font-size="12" text-anchor="end">
        ${val.toFixed(0)}
      </text>
    `;
  }

  labels.forEach((label, i) => {
    const xPos = pad + i * stepX;
    svg += `
      <text x="${xPos}" y="${height - pad + 18}" font-size="12" text-anchor="middle">
        ${label}
      </text>
    `;
  });

  datasets.forEach((dataset, di) => {
    let path = "";
    const color = colors[di % colors.length];

    dataset.forEach((val, i) => {
      const xPos = pad + i * stepX;
      const yPos = scaleY(val);
      path += i === 0 ? `M ${xPos} ${yPos}` : ` L ${xPos} ${yPos}`;

      svg += `
        <circle cx="${xPos}" cy="${yPos}" r="4" fill="${color}"/>
      `;
    });

    svg += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2"/>`;
  });

  svg += `</svg>`;
  return svg;
},

  pie({ labels = [], data = [] }) {
    if (!labels.length || labels.length !== data.length) return "";

    const width = 600;
    const height = 400;

    const radius = Math.min(width, height) / 3;
    const cx = width / 2;
    const cy = height / 2;
    const total = data.reduce((a, b) => a + b, 0);

    let startAngle = 0;

    let svg = `
      <svg
        viewBox="0 0 ${width} ${height}"
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
    `;

    data.forEach((val, i) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      svg += `
        <path d="M ${cx} ${cy}
                 L ${x1} ${y1}
                 A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
                 Z"
              fill="hsl(${i * 60},70%,60%)"/>
      `;

      const mid = startAngle + sliceAngle / 2;
      const lineStartX = cx + radius * Math.cos(mid);
      const lineStartY = cy + radius * Math.sin(mid);
      const lineEndX = cx + (radius + 30) * Math.cos(mid);
      const lineEndY = cy + (radius + 30) * Math.sin(mid);

      const percent = ((val / total) * 100).toFixed(1);
      const anchor = Math.cos(mid) >= 0 ? "start" : "end";

      svg += `
        <line x1="${lineStartX}" y1="${lineStartY}" x2="${lineEndX}" y2="${lineEndY}" stroke="black"/>
        <text x="${lineEndX + (anchor === "start" ? 5 : -5)}"
              y="${lineEndY}"
              font-size="12"
              text-anchor="${anchor}">
          ${labels[i]} (${val} | ${percent}%)
        </text>
      `;

      startAngle = endAngle;
    });

    svg += `</svg>`;
    return svg;
  }
};