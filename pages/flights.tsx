import * as d3 from 'd3'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef } from 'react'
import styles from '../styles/Home.module.css'

const Flights: NextPage = () => {

  useEffect( async () => {
    const res = await fetch("/api/data/flights")
    const json = await res.json()
    // setData(json.data)
    // setFilteredData(json.data)
    const svgEl = d3.select(svgRef.current);
    svgEl.append("g")
      .attr("id", "boxes")
      .selectAll("circle")
      .data(json.data)
      .join("circle")
        .attr("r", (d) => d * 10)
        .attr("cx", (d,i) => i * 30 )
        .attr("cy", 150 )
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "blue")
    console.log(json)
  }, [])

  // const [selectedCountry, setSelectedCountry] = useState(null)
  // const [filterData, setFilteredData] = useState(null)
  // const [data, setData] = useState(null)

  // useEffect(() => {
  //   setFilteredData(data.filter(d => d > selectedCountry))
  // }, [selectedCountry])
  
  const svgRef = useRef(null)
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Flights</h1>
        <svg ref={svgRef} width={300} height={300} />
        {/* <select onChange={(e) => setSelectedCountry(e.target.value)}></select>
        <Navigation>
        <Flowmap thematicData={filteredData} geographicData="" />
        <Flowmap thematicData=" " geographicData="" /> */}
      </main>
    </div>
  )
}

export default Flights