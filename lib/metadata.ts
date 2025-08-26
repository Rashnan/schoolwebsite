// Utility for managing page titles dynamically in client components
export const updatePageTitle = (title: string) => {
  if (typeof document !== 'undefined') {
    document.title = `${title} | MNU Marathon`;
  }
};

export const updatePageMetadata = (title: string, description?: string) => {
  if (typeof document !== 'undefined') {
    document.title = `${title} | MNU Marathon`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }
  }
};
