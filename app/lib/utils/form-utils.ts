
export const cleanFormData = (values: Record<string, any>) => {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value.trim() === '' ? null : value.trim();
    } 
    else if (Array.isArray(value)) {
      acc[key] = value.length === 0 ? [] : value;
    }
    else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
};

export const handleError = (error: any, toast: any, customMessage: string) => {
  console.error(error);
  toast({
    title: "Error",
    description: customMessage,
    variant: "destructive",
  });
}; 