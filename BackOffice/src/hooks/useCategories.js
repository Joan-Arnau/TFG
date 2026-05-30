import { useCallback, useEffect, useState } from 'react';
import { categoryService } from '../api/services/categoryService';

export const useCategories = (initialType = '') => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState(initialType);

  const loadCategories = useCallback(async (typeToLoad) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll(typeToLoad);
      setCategories(Array.isArray(data) ? data : []);
    } catch (currentError) {
      console.error('Error fetching categories:', currentError);
      setError(currentError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories(filterType);
    }, 0);
    return () => clearTimeout(timer);
  }, [filterType, loadCategories]);

  const createCategory = async (categoryData) => {
    setError(null);
    try {
      await categoryService.create(categoryData);
      await loadCategories(filterType);
    } catch (currentError) {
      console.error('Error creating category:', currentError);
      setError(currentError);
      throw currentError;
    }
  };

  const updateCategory = async (id, categoryData) => {
    setError(null);
    try {
      await categoryService.update(id, categoryData);
      await loadCategories(filterType);
    } catch (currentError) {
      console.error('Error updating category:', currentError);
      setError(currentError);
      throw currentError;
    }
  };

  const deleteCategory = async (id) => {
    setError(null);
    try {
      await categoryService.delete(id);
      await loadCategories(filterType);
    } catch (currentError) {
      console.error('Error deleting category:', currentError);
      setError(currentError);
      throw currentError;
    }
  };

  return {
    categories,
    loading,
    error,
    filterType,
    setFilterType,
    refresh: () => loadCategories(filterType),
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
