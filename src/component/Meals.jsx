import React, { useEffect, useState } from 'react'
import { pakistaniDishes } from './Data'
import './meal.css'

const Meals = () => {
  const [mealData, setMealData] = useState([])
  const [area, setArea] = useState('Pakistani')
  const [inputdata, setInputData] = useState('')
  
  const shortenName = (name, cuisine) => {
    if (cuisine.toLowerCase() === "american") {
      return name.split(' ').slice(0, 2).join(' ')
    }
    return name
  }

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      if (area.toLowerCase() === "pakistani") {
        setMealData(pakistaniDishes.meals)
        return
      }

      const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
      const data = await api.json()
      
      if (data.meals) {
        const processedMeals = data.meals.map(meal => ({
          ...meal,
          strMeal: shortenName(meal.strMeal, area)
        }))
        setMealData(processedMeals)
      }
    }
    fetchDataFromAPI()
  }, [area])

  const submitHandler = async (e) => {
    e.preventDefault()

    if (area.toLowerCase() === "pakistani") {
      const filtered = pakistaniDishes.meals.filter(dish =>
        dish.strMeal.toLowerCase().includes(inputdata.toLowerCase())
      )
      setMealData(filtered)
      setInputData('')
      return
    }

    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputdata}`)
    const data = await api.json()
    
    if (data.meals) {
      const processedMeals = data.meals.map(meal => ({
        ...meal,
        strMeal: shortenName(meal.strMeal, area)
      }))
      setMealData(processedMeals)
    }
    setInputData('')
  }

  return (
    <>
      <div className="my-3" style={{ width: '1000px', margin: "auto" }}>
        <div className="mx-auto text-center">
          <button onClick={() => setArea("pakistani")} type="button" className="btn btn-outline-success mx-3">Pakistani</button>
          <button onClick={() => setArea("indian")} type="button" className="btn btn-outline-primary mx-3">Indian</button>
          <button onClick={() => setArea("canadian")} type="button" className="btn btn-outline-warning mx-3">Canadian</button>
          <button onClick={() => setArea("malaysian")} type="button" className="btn btn-outline-light mx-3">Malaysian</button>
          <button onClick={() => setArea("japanese")} type="button" className="btn btn-outline-warning mx-3">Japanese</button>
          <button onClick={() => setArea("russian")} type="button" className="btn btn-outline-info mx-3">Russian</button>
          <button onClick={() => setArea("chinese")} type="button" className="btn btn-outline-light mx-3">Chinese</button>
        </div>
      </div>

      <form onSubmit={submitHandler} className="mx-auto text-center my-3">
        <input
          value={inputdata}
          onChange={(e) => setInputData(e.target.value)}
          type="text"
          placeholder="Search meals..."
        />
      </form>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "2rem"
      }}>
        {mealData && mealData.length > 0 ? (
          mealData.map((data) => (
            <div key={data.idMeal} style={{ textAlign: "center" }}>
              <div style={{
                width: "220px",
                height: "180px",
                overflow: "hidden",
                borderRadius: "10px",
                border: "2px solid blue"
              }}>
                <img
                  src={data.strMealThumb}
                  alt={data.strMeal}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
              <h5 style={{ marginTop: "8px" }}>{data.strMeal}</h5>
            </div>
          ))
        ) : (
          <h4 style={{ textAlign: "center", width: "100%" }}>No meals found</h4>
        )}
      </div>
    </>
  )
}

export default Meals