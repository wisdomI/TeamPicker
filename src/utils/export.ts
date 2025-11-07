// formatDateTime doesn't need heavy libraries, so we keep it here
export function formatDateTime(date: Date): string {
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  // Format: "November 7, 2025 • 2:35 PM"
  return `${month} ${day}, ${year} • ${time}`;
}

export async function exportToPDF(
  teams: string[][],
  dateTime: string,
  teamSize: number
): Promise<void> {
  // Dynamically import jsPDF to code-split the bundle
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const cardWidth = (pageWidth - margin * 3) / 2;
  const cardPadding = 8;
  let xPos = margin;
  let yPos = margin;
  let teamIndex = 0;

  // Helper function to draw a team card
  const drawTeamCard = (team: string[], teamNum: number, x: number, y: number, width: number) => {
    const cardHeight = 25 + (team.length * 9) + 12;
    let currentY = y;
    
    // Card background (white) - using rect since roundedRect might not be available
    doc.setFillColor(255, 255, 255);
    doc.rect(x, currentY, width, cardHeight, 'F');
    
    // Card border (electric blue)
    doc.setDrawColor(0, 122, 255);
    doc.setLineWidth(0.8);
    doc.rect(x, currentY, width, cardHeight, 'D');
    
    // Team header with electric blue background
    doc.setFillColor(0, 122, 255);
    doc.rect(x, currentY, width, 15, 'F');
    
    // Team title (white text on blue background)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Team ${teamNum}`, x + cardPadding, currentY + 10);
    
    // Team icon area (lime green accent circle)
    doc.setFillColor(51, 255, 87);
    doc.circle(x + width - 12, currentY + 7.5, 3, 'F');
    
    // Move to player names section
    currentY += 18;
    
    // Player names
    doc.setFontSize(10);
    team.forEach((name, idx) => {
      // Player item background (light blue tint - using a light gray fill)
      doc.setFillColor(230, 240, 255);
      doc.rect(x + cardPadding, currentY, width - cardPadding * 2, 8, 'F');
      
      // Player letter (lime green)
      doc.setTextColor(51, 255, 87);
      doc.setFont('helvetica', 'bold');
      doc.text(String.fromCharCode(65 + idx), x + cardPadding + 2, currentY + 6);
      
      // Player name (charcoal black)
      doc.setTextColor(28, 28, 28);
      doc.setFont('helvetica', 'normal');
      doc.text(name, x + cardPadding + 8, currentY + 6);
      currentY += 9;
    });
    
    // Footer divider line
    currentY += 3;
    doc.setDrawColor(0, 122, 255);
    doc.setLineWidth(0.3);
    doc.line(x + cardPadding, currentY, x + width - cardPadding, currentY);
    currentY += 6;
    
    // Player count footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${team.length} ${team.length === 1 ? 'player' : 'players'}`, x + width / 2, currentY, { align: 'center' });
    
    return cardHeight + 5; // Return height used
  };

  // Header section with charcoal black background
  doc.setFillColor(28, 28, 28);
  doc.rect(0, 0, pageWidth, 55, 'F');
  
  // Title (Electric Blue)
  doc.setTextColor(0, 122, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('TeamShuffler Pro', pageWidth / 2, 28, { align: 'center' });
  
  // Subtitle information (white text)
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${dateTime}`, pageWidth / 2, 38, { align: 'center' });
  
  // Team size info (Lime Green)
  doc.setTextColor(51, 255, 87);
  doc.setFontSize(10);
  doc.text(`Team Size: ${teamSize} players per team`, pageWidth / 2, 45, { align: 'center' });

  // Start teams below header
  yPos = 65;
  xPos = margin;

  // Draw teams in a 2-column grid
  teams.forEach((team, index) => {
    // Check if we need a new page
    const cardHeight = 25 + (team.length * 9) + 12 + 5;
    if (yPos + cardHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      xPos = margin;
      teamIndex = 0;
    }
    
    // Draw the team card
    const heightUsed = drawTeamCard(team, index + 1, xPos, yPos, cardWidth);
    
    // Move to next position (2-column layout)
    if (teamIndex % 2 === 0) {
      // Move to right column
      xPos += cardWidth + margin;
    } else {
      // Move to next row, left column
      xPos = margin;
      yPos += heightUsed;
    }
    teamIndex++;
  });

  doc.save(`teams-${Date.now()}.pdf`);
}

export async function exportToPNG(
  elementId: string,
  filename: string
): Promise<void> {
  // Dynamically import html2canvas to code-split the bundle
  const { default: html2canvas } = await import('html2canvas');
  const element = document.getElementById(elementId);
  if (!element) return;

  // Wait for all animations to complete (longer delay to ensure first card is rendered)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Hide confetti and other overlay elements that might interfere
  const overlays = document.querySelectorAll('[class*="fixed"]');
  const originalDisplay: string[] = [];
  overlays.forEach((el) => {
    const htmlEl = el as HTMLElement;
    originalDisplay.push(htmlEl.style.display);
    htmlEl.style.display = 'none';
  });

  // Force all animated elements to their final state
  const allElements = element.querySelectorAll('*');
  const originalStyles: { element: HTMLElement; styles: { [key: string]: string } }[] = [];
  
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const computedStyle = window.getComputedStyle(htmlEl);
    
    // Store original styles
    originalStyles.push({
      element: htmlEl,
      styles: {
        animation: htmlEl.style.animation,
        opacity: htmlEl.style.opacity,
        transform: htmlEl.style.transform,
      }
    });

    // Force final state - remove animations and ensure visibility
    if (computedStyle.animation !== 'none' || computedStyle.animationName !== 'none') {
      htmlEl.style.animation = 'none';
      htmlEl.style.animationName = 'none';
    }
    
    // Ensure opacity is 1 for all visible elements
    if (computedStyle.opacity !== '1' && computedStyle.display !== 'none') {
      htmlEl.style.opacity = '1';
    }
    
    // Reset transforms to final state
    if (computedStyle.transform && computedStyle.transform !== 'none') {
      // Only reset if it's a transform that affects visibility
      if (computedStyle.transform.includes('translate') || computedStyle.transform.includes('scale')) {
        htmlEl.style.transform = 'none';
      }
    }
  });

  // Additional wait for browser to render
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#1C1C1C',
      scale: 2,
      logging: false,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      allowTaint: true,
      removeContainer: false,
      onclone: (clonedDoc) => {
        // Ensure all styles are applied in the cloned document
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Target all elements with animation classes
          const animatedElements = clonedElement.querySelectorAll('[class*="animate-"]');
          animatedElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.opacity = '1';
            htmlEl.style.transform = 'none';
            htmlEl.style.animation = 'none';
            htmlEl.style.animationName = 'none';
            htmlEl.style.animationDelay = '0s';
          });
          
          // Specifically target cards
          const cards = clonedElement.querySelectorAll('[class*="card-flip"]');
          cards.forEach((card) => {
            const htmlCard = card as HTMLElement;
            htmlCard.style.opacity = '1';
            htmlCard.style.transform = 'none';
            htmlCard.style.animation = 'none';
          });
        }
      },
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  } finally {
    // Restore original styles
    originalStyles.forEach(({ element, styles }) => {
      element.style.animation = styles.animation;
      element.style.opacity = styles.opacity;
      element.style.transform = styles.transform;
    });

    // Restore overlays
    overlays.forEach((el, index) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.display = originalDisplay[index];
    });
  }
}

export function exportToTXT(
  teams: string[][],
  dateTime: string,
  teamSize: number
): void {
  let content = 'TeamShuffler Pro\n';
  content += '='.repeat(30) + '\n\n';
  content += `Generated on: ${dateTime}\n`;
  content += `Team Size: ${teamSize} players per team\n\n`;
  content += '='.repeat(30) + '\n\n';

  teams.forEach((team, index) => {
    content += `Team ${index + 1}\n`;
    content += '-'.repeat(20) + '\n';
    team.forEach((name) => {
      content += `  • ${name}\n`;
    });
    content += '\n';
  });

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = `teams-${Date.now()}.txt`;
  link.href = URL.createObjectURL(blob);
  link.click();
}

