import React, { useState } from 'react';
import { FileText, Download, Calendar, RefreshCw, Settings, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  name: string;
  generatedAt: Date;
  metrics: {
    engagement: number;
    reach: number;
    clicks: number;
    conversions: number;
  }[];
  insights: string[];
  keywords: {
    keyword: string;
    volume: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

const mockData = {
  metrics: [
    { date: '2024-03-01', engagement: 1200, reach: 5000, clicks: 300, conversions: 50 },
    { date: '2024-03-02', engagement: 1500, reach: 6000, clicks: 400, conversions: 60 },
    { date: '2024-03-03', engagement: 1100, reach: 4500, clicks: 250, conversions: 45 },
    { date: '2024-03-04', engagement: 1800, reach: 7000, clicks: 500, conversions: 75 },
    { date: '2024-03-05', engagement: 2000, reach: 8000, clicks: 600, conversions: 90 },
  ],
  keywords: [
    { keyword: 'digital marketing', volume: 1200, trend: 'up' as const },
    { keyword: 'social media', volume: 800, trend: 'stable' as const },
    { keyword: 'content strategy', volume: 600, trend: 'up' as const },
    { keyword: 'SEO optimization', volume: 500, trend: 'down' as const },
  ],
  insights: [
    'Posts with video content saw 45% higher engagement',
    'Peak engagement times shifted to early morning (8-10 AM)',
    'User-generated content campaigns outperformed branded content by 2.3x',
    'Email campaigns had a 12% increase in open rates',
  ],
};

const ReportGenerator = () => {
  const [selectedInterval, setSelectedInterval] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newReport: Report = {
        id: Date.now().toString(),
        type: selectedInterval,
        name: `${selectedInterval.charAt(0).toUpperCase() + selectedInterval.slice(1)} Report - ${format(new Date(), 'MMM d, yyyy')}`,
        generatedAt: new Date(),
        metrics: mockData.metrics.map(m => ({
          engagement: m.engagement,
          reach: m.reach,
          clicks: m.clicks,
          conversions: m.conversions,
        })),
        insights: mockData.insights,
        keywords: mockData.keywords,
      };

      setRecentReports([newReport, ...recentReports].slice(0, 5));
      generatePDF(newReport);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDF = (report: Report) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Title
    doc.setFontSize(20);
    doc.text(report.name, 20, 20);

    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(report.generatedAt, 'PPP')}`, 20, 30);

    // Metrics Summary
    doc.setFontSize(16);
    doc.text('Performance Metrics', 20, 45);

    const metricsData = mockData.metrics.map(m => [
      format(new Date(m.date), 'MMM d'),
      m.engagement.toString(),
      m.reach.toString(),
      m.clicks.toString(),
      m.conversions.toString(),
    ]);

    (doc as any).autoTable({
      head: [['Date', 'Engagement', 'Reach', 'Clicks', 'Conversions']],
      body: metricsData,
      startY: 50,
    });

    // Top Keywords
    doc.setFontSize(16);
    doc.text('Top Keywords', 20, doc.lastAutoTable.finalY + 20);

    const keywordsData = report.keywords.map(k => [
      k.keyword,
      k.volume.toString(),
      k.trend.toUpperCase(),
    ]);

    (doc as any).autoTable({
      head: [['Keyword', 'Volume', 'Trend']],
      body: keywordsData,
      startY: doc.lastAutoTable.finalY + 25,
    });

    // AI Insights
    doc.setFontSize(16);
    doc.text('AI-Generated Insights', 20, doc.lastAutoTable.finalY + 20);

    doc.setFontSize(12);
    let yPos = doc.lastAutoTable.finalY + 30;
    report.insights.forEach((insight, index) => {
      doc.text(`${index + 1}. ${insight}`, 20, yPos);
      yPos += 10;
    });

    // Save the PDF
    doc.save(`${report.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-gray-900">Report Generator</h3>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value as 'daily' | 'weekly' | 'monthly')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE]"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagement" stroke="#00E5BE" />
                <Line type="monotone" dataKey="reach" stroke="#0088FE" />
                <Line type="monotone" dataKey="clicks" stroke="#00C49F" />
                <Line type="monotone" dataKey="conversions" stroke="#FFBB28" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Keywords */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-4">Top Keywords</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.keywords}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keyword" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volume" fill="#00E5BE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">AI-Generated Insights</h4>
          <div className="flex items-center space-x-2 text-gray-500">
            <Brain className="w-5 h-5" />
            <span className="text-sm">Powered by AI</span>
          </div>
        </div>
        <div className="space-y-3">
          {mockData.insights.map((insight, index) => (
            <div
              key={index}
              className="p-3 bg-white rounded-lg border border-gray-200"
            >
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="p-6 bg-gray-50 rounded-xl">
        <h4 className="font-medium text-gray-900 mb-4">Recent Reports</h4>
        <div className="space-y-3">
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500">
                    Generated {format(report.generatedAt, 'PPp')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => generatePDF(report)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Report Settings */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">Reports are generated in your timezone (UTC)</span>
        </div>
        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
          <Settings className="w-5 h-5" />
          <span>Configure Reports</span>
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;