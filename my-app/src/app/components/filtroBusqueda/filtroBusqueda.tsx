"use client"

import { Button } from "@/libs/button/button"
import { useState, useRef, useEffect, FormEvent, MouseEvent } from "react"
import type React from "react"

// Definir tipos para los botones de filtro
interface FilterButton {
  id: number
  label: string
}

// Botones de filtro de ejemplo
const filterButtons: FilterButton[] = [
  { id: 1, label: "Filtro 1" },
  { id: 2, label: "Filtro 2" },
  { id: 3, label: "Filtro 3" },
  { id: 4, label: "Filtro 4" },
  { id: 5, label: "Filtro 5" },
]

// Definir tipos para las categorías de filtro
interface FilterCategory {
  id: string
  label: string
}

// Categorías de filtro de ejemplo
const filterCategories: FilterCategory[] = [
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
  { id: "transmision", label: "Transmisión" },
  { id: "consumo", label: "Consumo" },
  { id: "color", label: "Color" },
  { id: "tarifa", label: "Tarifa" },
  { id: "disponible", label: "Disponible" },
]

// Definir tipos para los botones de navegación
interface NavButton {
  id: number
  label: string
}

// Botones de navegación de ejemplo
const navButtons: NavButton[] = [
  { id: 1, label: "Boton1" },
  { id: 2, label: "Boton2" },
  { id: 3, label: "Boton3" },
  { id: 4, label: "Boton4" },
]

// Historial de búsqueda de ejemplo
const sampleSearchHistory: string[] = [
  "Nissan Frontier 2023",
  "Toyota Hilux",
  "Ford Ranger",
  "Camionetas 4x4",
  "Vehículos familiares",
]

// Interfaz para los filtros seleccionados
interface SelectedFilter {
  filterId: number
  categoryId: string
  categoryLabel: string
}

export default function Home(): React.ReactElement {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [selectedFilterCategories, setSelectedFilterCategories] = useState<SelectedFilter[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<string>("")
  const [showSearchHistory, setShowSearchHistory] = useState<boolean>(false)
  const [searchHistory, setSearchHistory] = useState<string[]>(sampleSearchHistory)

  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchHistory(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e: FormEvent): void => {
    e.preventDefault()
    if (searchInput.trim()) {
      if (!searchHistory.includes(searchInput)) {
        setSearchHistory([searchInput, ...searchHistory.slice(0, 4)])
      }
      setSearchInput("")
      setShowSearchHistory(false)
    }
  }

  const selectSearchHistoryItem = (item: string): void => {
    setSearchInput(item)
    setShowSearchHistory(false)
  }

  const toggleFilter = (filterId: string): void => {
    setActiveFilter((prev) => (prev === filterId ? null : filterId))
  }

  const selectFilterCategory = (filterId: number, categoryId: string, categoryLabel: string): void => {
    const existingFilterIndex = selectedFilterCategories.findIndex(
      (filter) => filter.filterId === filterId
    )

    if (existingFilterIndex >= 0) {
      const newFilters = [...selectedFilterCategories]
      newFilters[existingFilterIndex] = { filterId, categoryId, categoryLabel }
      setSelectedFilterCategories(newFilters)
    } else {
      setSelectedFilterCategories([
        ...selectedFilterCategories,
        { filterId, categoryId, categoryLabel },
      ])
    }

    setActiveFilter(null)
  }

  const getAvailableCategories = (): FilterCategory[] => {
    const selectedCategoryIds = selectedFilterCategories.map((filter) => filter.categoryId)
    return filterCategories.filter((category) => !selectedCategoryIds.includes(category.id))
  }

  const getSelectedCategory = (filterId: number): SelectedFilter | undefined => {
    return selectedFilterCategories.find((filter) => filter.filterId === filterId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="text-xl md:text-2xl font-bold text-[#f7941d]">REDIBO</div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 hover:text-[#f7941d]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navButtons.map((button) => (
              <button key={button.id} className="text-gray-700 hover:text-[#f7941d]">
                {button.label}
              </button>
            ))}
          </nav>

          {/* Navigation - Mobile */}
          {mobileMenuOpen && (
            <nav className="w-full md:hidden mt-3 pb-2 border-b border-gray-200">
              <div className="flex flex-col space-y-2">
                {navButtons.map((button) => (
                  <button key={button.id} className="text-gray-700 hover:text-[#f7941d] py-1">
                    {button.label}
                  </button>
                ))}
              </div>
            </nav>
          )}

          {/* Auth buttons */}
          <div className={`flex items-center mt-3 md:mt-0 ${mobileMenuOpen ? "w-full" : "hidden md:flex"}`}>
            <Button className="flex-1 md:flex-none bg-[#f7941d] hover:bg-[#e68a1a] text-white rounded-r-none border-r border-[#e68a1a]">
              Registrarse
            </Button>
            <Button
              variant="outline"
              className="flex-1 md:flex-none border-[#f7941d] text-[#f7941d] hover:bg-[#fff8f0] rounded-l-none border-l-0"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-center">
          <div className="w-full md:w-auto flex items-center justify-center mb-3 md:mb-0 md:mr-4">
            <div ref={searchContainerRef} className="relative w-full max-w-md">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Buscar vehículos..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSearchHistory(true)}
                />
                <button
                  type="submit"
                  className="bg-[#f7941d] hover:bg-[#e68a1a] text-white px-3 py-2 rounded-r-md flex items-center justify-center transition-colors duration-200"
                  aria-label="Buscar"
                  title="Buscar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2 2-2 2m0-4l-2 2 2 2" /> </svg> </button> </form>
          {/* Historial de búsqueda */}
          {showSearchHistory && (
            <div className="absolute top-full mt-2 bg-white shadow-lg w-full border border-gray-300 rounded-md z-10">
              <ul className="max-h-60 overflow-y-auto">
                {searchHistory.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-gray-700 hover:bg-[#f7941d] hover:text-white cursor-pointer"
                    onClick={() => selectSearchHistoryItem(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
) }