import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, Plus, X } from 'lucide-react'

const ingredients = [
  'Chicken', 'Beef', 'Pork', 'Fish', 'Eggs', 'Rice', 'Pasta', 'Potatoes',
  'Tomatoes', 'Onions', 'Garlic', 'Cheese', 'Milk', 'Butter', 'Olive Oil'
]

const recipes = [
  { name: 'Chicken Rice', ingredients: ['Chicken', 'Rice', 'Onions', 'Garlic'], time: '30 min' },
  { name: 'Beef Pasta', ingredients: ['Beef', 'Pasta', 'Tomatoes', 'Garlic'], time: '25 min' },
  { name: 'Fish & Potatoes', ingredients: ['Fish', 'Potatoes', 'Butter', 'Garlic'], time: '35 min' },
  { name: 'Egg Fried Rice', ingredients: ['Eggs', 'Rice', 'Onions', 'Olive Oil'], time: '15 min' },
  { name: 'Cheesy Pasta', ingredients: ['Pasta', 'Cheese', 'Milk', 'Butter'], time: '20 min' },
  { name: 'Chicken Tomato', ingredients: ['Chicken', 'Tomatoes', 'Onions', 'Olive Oil'], time: '40 min' },
  { name: 'Beef Rice Bowl', ingredients: ['Beef', 'Rice', 'Eggs', 'Garlic'], time: '30 min' },
  { name: 'Garlic Fish', ingredients: ['Fish', 'Garlic', 'Butter', 'Olive Oil'], time: '25 min' }
]

export default function Recipes() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    )
  }

  const filteredRecipes = recipes.filter(recipe =>
    selectedIngredients.length === 0 ||
    selectedIngredients.every(ingredient => recipe.ingredients.includes(ingredient))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ChefHat className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold gradient-text">Recipe Finder</h1>
          </div>
          <p className="text-gray-300">Select ingredients to find matching recipes</p>
        </motion.div>

        {/* Ingredients Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Available Ingredients</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {ingredients.map((ingredient) => (
              <motion.button
                key={ingredient}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleIngredient(ingredient)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  selectedIngredients.includes(ingredient)
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg'
                    : 'glass hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{ingredient}</span>
                  {selectedIngredients.includes(ingredient) ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-4 mb-8"
          >
            <h3 className="font-bold mb-2">Selected: {selectedIngredients.length} ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <h3 className="text-xl font-bold mb-3">{recipe.name}</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Ingredients:</p>
                <div className="flex flex-wrap gap-1">
                  {recipe.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className={`px-2 py-1 rounded text-xs ${
                        selectedIngredients.includes(ingredient)
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-medium">{recipe.time}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-sm font-medium"
                >
                  View Recipe
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRecipes.length === 0 && selectedIngredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No recipes found with selected ingredients</p>
            <p className="text-gray-500 text-sm mt-2">Try selecting fewer ingredients</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}