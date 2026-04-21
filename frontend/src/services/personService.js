export const getAllPersons = async () => {
  try {
    const response = await fetch('/api/v1/person');
    if (!response.ok) {
      throw new Error('Failed to fetch persons');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching persons:', error);
    return [];
  }
};