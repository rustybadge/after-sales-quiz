import jsPDF from 'jspdf';

interface QuizResults {
  company?: string;
  totalScore: number;
  personaName: string;
  categoryScores: {
    FTF: number;
    RemoteTriage: number;
    Parts: number;
    ETA: number;
    Playbooks: number;
    Predictive: number;
  };
  top3Weak: string[];
  recommendationState: 'quick-wins' | 'next-horizon' | 'maintain';
}

export function buildPlanPdf(results: QuizResults): Uint8Array {
  try {
    console.log('Creating jsPDF instance...');
    const doc = new jsPDF('p', 'mm', 'a4');
    console.log('jsPDF instance created successfully');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Set fonts
  doc.setFont('helvetica');
  
  // Header with Humblebee branding
  doc.setFillColor(59, 130, 246); // Blue color for header
  doc.rect(0, 0, pageWidth, 30);
  
  // Logo placeholder (you can replace this with actual logo)
  doc.setFillColor(255, 255, 255);
  doc.circle(25, 15, 8);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('🐝', 20, 20); // Bee emoji as logo placeholder
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('HUMBLEBEE', 40, 20);
  
  // Subtitle
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('After-Sales Performance Action Plan', 20, 40);
  
  // Company info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Company: ${results.company || 'Not specified'}`, 20, 55);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 62);
  doc.text(`Overall Score: ${results.totalScore}%`, 20, 69);
  doc.text(`Persona: ${results.personaName}`, 20, 76);
  
  // Score breakdown
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Category Scores', 20, 90);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const categories = [
    { name: 'First-Time-Fix', score: results.categoryScores.FTF, weight: '25%' },
    { name: 'Remote Triage', score: results.categoryScores.RemoteTriage, weight: '20%' },
    { name: 'Parts Availability', score: results.categoryScores.Parts, weight: '20%' },
    { name: 'ETA Discipline', score: results.categoryScores.ETA, weight: '15%' },
    { name: 'Playbooks', score: results.categoryScores.Playbooks, weight: '10%' },
    { name: 'Predictive Monitoring', score: results.categoryScores.Predictive, weight: '10%' }
  ];
  
  let yPos = 100;
  categories.forEach(cat => {
    const scoreColor = cat.score >= 80 ? [0, 128, 0] : cat.score >= 60 ? [255, 165, 0] : [255, 0, 0];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${cat.name} (${cat.weight})`, 20, yPos);
    doc.text(`${cat.score}%`, 120, yPos);
    yPos += 6;
  });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Recommendations section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Recommendations', 20, yPos + 10);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPos += 20;
  
  if (results.recommendationState === 'quick-wins') {
    doc.text('Focus on these quick wins to improve your score:', 20, yPos);
    yPos += 8;
    results.top3Weak.forEach((category, index) => {
      doc.text(`${index + 1}. Prioritize ${category} improvements`, 25, yPos);
      yPos += 6;
    });
  } else if (results.recommendationState === 'next-horizon') {
    doc.text('Your foundation is strong. Consider these advanced initiatives:', 20, yPos);
    yPos += 8;
    doc.text('1. Implement predictive monitoring', 25, yPos);
    yPos += 6;
    doc.text('2. Develop comprehensive playbooks', 25, yPos);
    yPos += 6;
    doc.text('3. Cross-team collaboration programs', 25, yPos);
  } else {
    doc.text('Excellent performance! Focus on sustaining your success:', 20, yPos);
    yPos += 8;
    doc.text('1. Monitor performance trends', 25, yPos);
    yPos += 6;
    doc.text('2. Share best practices', 25, yPos);
    yPos += 6;
    doc.text('3. Plan next-level improvements', 25, yPos);
  }
  
  // Next steps
  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Next Steps', 20, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPos += 8;
  doc.text('1. Review your category scores and focus on areas below 80%', 20, yPos);
  yPos += 6;
  doc.text('2. Implement the recommended improvements over the next 30 days', 20, yPos);
  yPos += 6;
  doc.text('3. Re-take this quiz in 30 days to measure progress', 20, yPos);
  yPos += 6;
  doc.text('4. Contact us for detailed implementation support', 20, yPos);
  
  // Footer with Humblebee branding
  doc.setFillColor(59, 130, 246); // Blue footer bar
  doc.rect(0, pageHeight - 25, pageWidth, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('🐝 HUMBLEBEE', 20, pageHeight - 15);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by Humblebee After-Sales Quiz', 20, pageHeight - 10);
  doc.text('hello@humblebee.se | www.humblebee.se', 20, pageHeight - 5);
  
    console.log('Generating PDF output...');
    const output = doc.output('arraybuffer');
    console.log('PDF output generated, type:', typeof output, 'length:', output.byteLength);
    
    // Convert ArrayBuffer to Uint8Array properly
    const uint8Array = new Uint8Array(output);
    console.log('Converted to Uint8Array, length:', uint8Array.length);
    
    return uint8Array;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}
