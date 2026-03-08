export const chart = {
    bar({
        labels = [],
        data = [],
        colors = {}
    }) {
        if (!labels.length || labels.length !== data.length) return "";

        const {
            background = "white",
            text = "black",
            axis = "black",
            grid = "#ddd",
            bar = "steelblue"
        } = colors;

        const minBarWidth = 40;
        const pad = 50;
        const height = 400;
        const width = Math.max(600, pad * 2 + labels.length * minBarWidth);
        const barWidth = (width - pad * 2) / data.length;
        const maxY = Math.max(...data);
        const scaleY = v => height - pad - (v / (maxY || 1)) * (height - pad * 2);

        let svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">`;

        svg += `<rect width="${width}" height="${height}" fill="${background}"/>`;

        svg += `
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="${axis}"/>
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="${axis}"/>
    `;

        for (let i = 0; i <= 5; i++) {
            const val = (maxY / 5) * i;
            const yPos = scaleY(val);
            svg += `
        <line x1="${pad}" y1="${yPos}" x2="${width - pad}" y2="${yPos}" stroke="${grid}"/>
        <text x="${pad - 8}" y="${yPos + 4}" font-size="12" fill="${text}" text-anchor="end">${val.toFixed(0)}</text>
      `;
        }

        labels.forEach((label, i) => {
            const barHeight = (data[i] / (maxY || 1)) * (height - pad * 2);
            const yPos = height - pad - barHeight;
            const xPos = pad + i * barWidth;
            const truncated = label.length > 8 ? label.slice(0, 7) + "…" : label;

            svg += `
        <rect x="${xPos + 2}" y="${yPos}" width="${barWidth - 8}" height="${barHeight}" fill="${bar}"/>
        <text x="${xPos + barWidth / 2}" y="${height - pad + 18}" font-size="11" fill="${text}" text-anchor="middle">${truncated}</text>
      `;
        });

        svg += `</svg>`;
        return svg;
    },

    line({
        labels = [],
        data = [],
        colors = {}
    }) {
        if (!labels.length || !Array.isArray(data) || !data.length) return "";

        const {
            background = "white",
            text = "black",
            axis = "black",
            grid = "#ddd",
            lines = ["steelblue", "tomato", "seagreen", "orange", "purple", "brown"],
            points
        } = colors;

        const datasets = Array.isArray(data[0]) ? data : [data];
        const length = labels.length;
        if (!datasets.every(arr => arr.length === length)) return "";

        const minStepX = 50;
        const pad = 50;
        const height = 400;
        const width = Math.max(600, pad * 2 + (length - 1) * minStepX);
        const flat = datasets.flat();
        const maxY = Math.max(...flat);
        const stepX = length > 1 ? (width - pad * 2) / (length - 1) : 0;
        const scaleY = v => height - pad - (v / (maxY || 1)) * (height - pad * 2);

        let svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">`;

        svg += `<rect width="${width}" height="${height}" fill="${background}"/>`;

        svg += `
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="${axis}"/>
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="${axis}"/>
    `;

        for (let i = 0; i <= 5; i++) {
            const val = (maxY / 5) * i;
            const yPos = scaleY(val);
            svg += `
        <line x1="${pad}" y1="${yPos}" x2="${width - pad}" y2="${yPos}" stroke="${grid}"/>
        <text x="${pad - 8}" y="${yPos + 4}" font-size="12" fill="${text}" text-anchor="end">${val.toFixed(0)}</text>
      `;
        }

        const labelStep = Math.ceil(length / Math.floor((width - pad * 2) / 50));
        labels.forEach((label, i) => {
            if (i % labelStep !== 0 && i !== length - 1) return;
            const xPos = pad + i * stepX;
            const truncated = label.length > 8 ? label.slice(0, 7) + "…" : label;
            svg += `<text x="${xPos}" y="${height - pad + 18}" font-size="11" fill="${text}" text-anchor="middle">${truncated}</text>`;
        });

        datasets.forEach((dataset, di) => {
            let path = "";
            const color = lines[di % lines.length];

            dataset.forEach((val, i) => {
                const xPos = pad + i * stepX;
                const yPos = scaleY(val);
                path += i === 0 ? `M ${xPos} ${yPos}` : ` L ${xPos} ${yPos}`;
                svg += `<circle cx="${xPos}" cy="${yPos}" r="3" fill="${points || color}"/>`;
            });

            svg += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2"/>`;
        });

        svg += `</svg>`;
        return svg;
    },

    pie({
        labels = [],
        data = [],
        colors = {}
    }) {
        if (!labels.length || labels.length !== data.length) return "";

        const {
            background = "white",
            text = "black",
            lines = "#666",
            slices = [
                "#4e79a7",
                "#f28e2b",
                "#e15759",
                "#76b7b2",
                "#59a14f",
                "#edc948",
                "#b07aa1",
                "#ff9da7"
            ]
        } = colors;

        const width = 700;
        const height = 500;
        const radius = Math.min(width, height) / 3.5;
        const cx = width / 2;
        const cy = height / 2;
        const total = data.reduce((a, b) => a + b, 0);

        let startAngle = 0;

        let svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">`;

        svg += `<rect width="${width}" height="${height}" fill="${background}"/>`;

        data.forEach((val, i) => {
            const sliceAngle = (val / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;

            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy + radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy + radius * Math.sin(endAngle);
            const largeArc = sliceAngle > Math.PI ? 1 : 0;

            const color = slices[i % slices.length];

            svg += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${color}"/>`;

            if (sliceAngle > 0.15) {
                const mid = startAngle + sliceAngle / 2;
                const lineStartX = cx + radius * Math.cos(mid);
                const lineStartY = cy + radius * Math.sin(mid);
                const lineEndX = cx + (radius + 40) * Math.cos(mid);
                const lineEndY = cy + (radius + 40) * Math.sin(mid);

                const percent = ((val / total) * 100).toFixed(1);
                const anchor = Math.cos(mid) >= 0 ? "start" : "end";
                const textX = lineEndX + (anchor === "start" ? 5 : -5);

                svg += `
          <line x1="${lineStartX}" y1="${lineStartY}" x2="${lineEndX}" y2="${lineEndY}" stroke="${lines}"/>
          <text x="${textX}" y="${lineEndY}" font-size="11" fill="${text}" text-anchor="${anchor}">
            ${labels[i]} (${percent}%)
          </text>
        `;
            }

            startAngle = endAngle;
        });

        svg += `</svg>`;
        return svg;
    }
};
