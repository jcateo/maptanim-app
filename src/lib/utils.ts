import AsyncStorage from '@react-native-async-storage/async-storage';
import { Farm } from '../types';

const FARMS_KEY = '@maptanim/farms';

export async function getFarms(): Promise<Farm[]> {
  try {
    const data = await AsyncStorage.getItem(FARMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading farms:', error);
    return [];
  }
}

export async function addFarm(farm: Farm): Promise<void> {
  try {
    const farms = await getFarms();
    farms.push(farm);
    await AsyncStorage.setItem(FARMS_KEY, JSON.stringify(farms));
  } catch (error) {
    console.error('Error adding farm:', error);
    throw error;
  }
}

export async function updateFarm(farm: Farm): Promise<void> {
  try {
    const farms = await getFarms();
    const index = farms.findIndex(f => f.id === farm.id);
    if (index !== -1) {
      farms[index] = farm;
      await AsyncStorage.setItem(FARMS_KEY, JSON.stringify(farms));
    }
  } catch (error) {
    console.error('Error updating farm:', error);
    throw error;
  }
}

export async function deleteFarm(id: string): Promise<void> {
  try {
    const farms = await getFarms();
    const filtered = farms.filter(f => f.id !== id);
    await AsyncStorage.setItem(FARMS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting farm:', error);
    throw error;
  }
}

export async function getFarmById(id: string): Promise<Farm | null> {
  try {
    const farms = await getFarms();
    return farms.find(f => f.id === id) || null;
  } catch (error) {
    console.error('Error getting farm:', error);
    return null;
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function calculateDaysRemaining(farm: Farm): number {
  const plantingDate = new Date(farm.plantingDate);
  const today = new Date();
  const daysElapsed = Math.floor((today.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysToHarvest = farm.crop.daysToHarvest;
  return Math.max(0, daysToHarvest - daysElapsed);
}

export function calculateProgress(farm: Farm): number {
  const plantingDate = new Date(farm.plantingDate);
  const today = new Date();
  const daysElapsed = Math.floor((today.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysToHarvest = farm.crop.daysToHarvest;
  return Math.min(100, Math.round((daysElapsed / daysToHarvest) * 100));
}
