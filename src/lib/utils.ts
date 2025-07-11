export function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    Technology: 'bg-blue-600',
    Lifestyle: 'bg-pink-600',
    Travel: 'bg-green-600',
  };

  return colorMap[categoryName] || 'bg-gray-600';
}