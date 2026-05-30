"use client"

import * as React from "react"
import { mockProducts, mockCategories, mockInventory } from "@/lib/mock-data"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  available: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Ingredient {
  id: string
  name: string
  unit: string
  quantity: number
  minQuantity: number
  price: number
  supplier: string
}

export interface Addon {
  id: string
  name: string
  price: number
}

export interface PdvSettings {
  serviceFee: number
  taxRate: number
  enableShortcuts: boolean
  receiptPrinter: string
}

export interface KdsSettings {
  alertSound: boolean
  alertDelayMinutes: number
  oldestFirst: boolean
}

export interface DeliverySettings {
  flatDeliveryFee: number
  minOrderAmount: number
  averageDeliveryMinutes: number
  autoAcceptOrders: boolean
}

interface SettingsContextType {
  products: Product[]
  categories: Category[]
  inventory: Ingredient[]
  addons: Addon[]
  pdvSettings: PdvSettings
  kdsSettings: KdsSettings
  deliverySettings: DeliverySettings
  
  // Product actions
  addProduct: (product: Omit<Product, "id">) => void
  editProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Category actions
  addCategory: (category: Omit<Category, "id">) => void
  editCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // Inventory actions
  addIngredient: (ingredient: Omit<Ingredient, "id">) => void
  editIngredient: (id: string, ingredient: Partial<Ingredient>) => void
  deleteIngredient: (id: string) => void
  updateIngredientStock: (id: string, quantity: number) => void
  
  // Addon actions
  addAddon: (addon: Omit<Addon, "id">) => void
  deleteAddon: (id: string) => void
  
  // Settings actions
  updatePdvSettings: (settings: Partial<PdvSettings>) => void
  updateKdsSettings: (settings: Partial<KdsSettings>) => void
  updateDeliverySettings: (settings: Partial<DeliverySettings>) => void
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined)

const mockAddonsList: Addon[] = [
  { id: "a1", name: "Bacon Premium", price: 4.5 },
  { id: "a2", name: "Cheddar Cremoso", price: 3.5 },
  { id: "a3", name: "Ovo Frito", price: 2.0 },
  { id: "a4", name: "Batata Frita Adicional", price: 6.9 },
  { id: "a5", name: "Cebola Caramelizada", price: 3.0 },
]

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [inventory, setInventory] = React.useState<Ingredient[]>([])
  const [addons, setAddons] = React.useState<Addon[]>([])
  
  const [pdvSettings, setPdvSettings] = React.useState<PdvSettings>({
    serviceFee: 10,
    taxRate: 6.5,
    enableShortcuts: true,
    receiptPrinter: "Caixa Térmica 80mm",
  })
  
  const [kdsSettings, setKdsSettings] = React.useState<KdsSettings>({
    alertSound: true,
    alertDelayMinutes: 15,
    oldestFirst: true,
  })
  
  const [deliverySettings, setDeliverySettings] = React.useState<DeliverySettings>({
    flatDeliveryFee: 7.0,
    minOrderAmount: 20.0,
    averageDeliveryMinutes: 40,
    autoAcceptOrders: false,
  })

  // Load from local storage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("rest_products")
      const storedCategories = localStorage.getItem("rest_categories")
      const storedInventory = localStorage.getItem("rest_inventory")
      const storedAddons = localStorage.getItem("rest_addons")
      const storedPdv = localStorage.getItem("rest_settings_pdv")
      const storedKds = localStorage.getItem("rest_settings_kds")
      const storedDelivery = localStorage.getItem("rest_settings_delivery")

      if (storedProducts) setProducts(JSON.parse(storedProducts))
      else setProducts(mockProducts)

      if (storedCategories) setCategories(JSON.parse(storedCategories))
      else setCategories(mockCategories)

      if (storedInventory) setInventory(JSON.parse(storedInventory))
      else setInventory(mockInventory)

      if (storedAddons) setAddons(JSON.parse(storedAddons))
      else setAddons(mockAddonsList)

      if (storedPdv) setPdvSettings(JSON.parse(storedPdv))
      if (storedKds) setKdsSettings(JSON.parse(storedKds))
      if (storedDelivery) setDeliverySettings(JSON.parse(storedDelivery))
    }
  }, [])

  // Helper function to persist state
  const saveState = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }

  // Product actions
  const addProduct = (p: Omit<Product, "id">) => {
    const newProducts = [...products, { ...p, id: `prod-${Date.now()}` }]
    setProducts(newProducts)
    saveState("rest_products", newProducts)
  }

  const editProduct = (id: string, updated: Partial<Product>) => {
    const newProducts = products.map((p) => (p.id === id ? { ...p, ...updated } : p))
    setProducts(newProducts)
    saveState("rest_products", newProducts)
  }

  const deleteProduct = (id: string) => {
    const newProducts = products.filter((p) => p.id !== id)
    setProducts(newProducts)
    saveState("rest_products", newProducts)
  }

  // Category actions
  const addCategory = (c: Omit<Category, "id">) => {
    const newCats = [...categories, { ...c, id: `cat-${Date.now()}` }]
    setCategories(newCats)
    saveState("rest_categories", newCats)
  }

  const editCategory = (id: string, updated: Partial<Category>) => {
    const newCats = categories.map((c) => (c.id === id ? { ...c, ...updated } : c))
    setCategories(newCats)
    saveState("rest_categories", newCats)
  }

  const deleteCategory = (id: string) => {
    const newCats = categories.filter((c) => c.id !== id)
    setCategories(newCats)
    saveState("rest_categories", newCats)
  }

  // Inventory actions
  const addIngredient = (i: Omit<Ingredient, "id">) => {
    const newInv = [...inventory, { ...i, id: `ing-${Date.now()}` }]
    setInventory(newInv)
    saveState("rest_inventory", newInv)
  }

  const editIngredient = (id: string, updated: Partial<Ingredient>) => {
    const newInv = inventory.map((i) => (i.id === id ? { ...i, ...updated } : i))
    setInventory(newInv)
    saveState("rest_inventory", newInv)
  }

  const deleteIngredient = (id: string) => {
    const newInv = inventory.filter((i) => i.id !== id)
    setInventory(newInv)
    saveState("rest_inventory", newInv)
  }

  const updateIngredientStock = (id: string, qty: number) => {
    const newInv = inventory.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    setInventory(newInv)
    saveState("rest_inventory", newInv)
  }

  // Addon actions
  const addAddon = (a: Omit<Addon, "id">) => {
    const newAddons = [...addons, { ...a, id: `add-${Date.now()}` }]
    setAddons(newAddons)
    saveState("rest_addons", newAddons)
  }

  const deleteAddon = (id: string) => {
    const newAddons = addons.filter((a) => a.id !== id)
    setAddons(newAddons)
    saveState("rest_addons", newAddons)
  }

  // Settings actions
  const updatePdvSettings = (updated: Partial<PdvSettings>) => {
    const newSettings = { ...pdvSettings, ...updated }
    setPdvSettings(newSettings)
    saveState("rest_settings_pdv", newSettings)
  }

  const updateKdsSettings = (updated: Partial<KdsSettings>) => {
    const newSettings = { ...kdsSettings, ...updated }
    setKdsSettings(newSettings)
    saveState("rest_settings_kds", newSettings)
  }

  const updateDeliverySettings = (updated: Partial<DeliverySettings>) => {
    const newSettings = { ...deliverySettings, ...updated }
    setDeliverySettings(newSettings)
    saveState("rest_settings_delivery", newSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        products,
        categories,
        inventory,
        addons,
        pdvSettings,
        kdsSettings,
        deliverySettings,
        
        addProduct,
        editProduct,
        deleteProduct,
        
        addCategory,
        editCategory,
        deleteCategory,
        
        addIngredient,
        editIngredient,
        deleteIngredient,
        updateIngredientStock,
        
        addAddon,
        deleteAddon,
        
        updatePdvSettings,
        updateKdsSettings,
        updateDeliverySettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = React.useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
