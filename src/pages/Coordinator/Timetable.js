import React, { useState, createContext, useContext, useRef, useEffect, Suspense } from 'react';
import Timetable from '../../components/Timetable';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import { useAxios } from '../../Providers/AxiosProvider.js';
import { FallbackContent } from '../../components/FallbackContent.js';




function TimetableCoordinator() {

  const [classe, setClasse] = useState([]);

  const [loading, setLoading] = useState(true);  // État de chargement
  const { axios } = useAxios();


  function fetchClasse() {
    console.log('fetch classe');
    axios.get('/list/classes')
      .then(function (response) {

        const classes = response.data;
        setClasse((oldvalue) => [...classes]);
        setLoading(false);
        console.log(classes);

      })
      // .catch(function (error) {
      //   // handle error
      //   console.log(error);
      // });


  }


  useEffect(function () {

    fetchClasse();


  }, [])

  if (loading) return <FallbackContent />;


  return (

    <div className='div-container d-flex flex-column'>
      <Navbar />
      <div className='body-content-container d-flex'>
        <SidebarCoordinator />
        <section className='content-container'>

          <div className="container ">
            <div className="row">
              <div className="col-md-12 mt-3 ms-5">
                <h1 className='py-3'>Class</h1>
              </div>
              <div className="col-md-12 d-flex justify-content-between">
             

                <div>
                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                </div>
              </div>
              <div className="col-md-12 d-flex flex-wrap ">

                {classe.map((classe, index) => {
                  return <div key={index} className="card shadow w-25 m-3" >
                    <Link to={`/coordinator/timetable/class/${classe.id}/${classe.label}`}>
                      <div className="card-body">
                        <p className="card-text"><strong>{classe.label}</strong> </p>
                      </div>
                    </Link>
                  </div>

                })}


              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>

  )
}

export default TimetableCoordinator