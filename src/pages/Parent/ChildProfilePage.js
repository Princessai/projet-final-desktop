import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../../components/Navbar'
import Profile from '../../components/Profile'
import Footer from '../../components/Footer'
import SideBarParent from '../../components/SideBarParent'
import { useLocation, useParams } from 'react-router-dom'
import { useAxios } from '../../Providers/AxiosProvider'
import { FallbackContent } from '../../components/FallbackContent'

function ChildProfilePage() {
  console.log('ChildProfilePage____')

  const { state } = useLocation();
  console.log("🚀 ~ ChildProfilePage ~ state:", state)

  const { user_id } = useParams();


  const [loading, setLoading] = useState(() => {
    return state == null;
  });  // État de chargement
  console.log("🚀 ~ =useState ~ loading:", loading)

  const { axios } = useAxios();

  const child = useRef(null);

  if (state) {
    child.current = state.child;

  }

  useEffect(() => {
    let controller;
    controller = new AbortController();

    if (!state) {
      axios.get(`/user/${user_id}`, {
        signal: controller.signal
      })
        .then((response) => {
          child.current = response.data;
          console.log("🚀 ~ .then ~ child:", child.current)
          setLoading(false);
        })

    }

    return () => {
      controller.abort()
    }


  }, [])


  if (loading) {
    return <FallbackContent />
  }

  // const child = location.state;



  // const child = JSON.parse(localStorage.getItem("child"));

  // console.log("🚀 ~ StudentProfil ~ state:", state)

  console.log('chillllllddd', child.current);

  return (
    <div className='div-container d-flex flex-column'>
      <Navbar />
      <div className='body-content-container d-flex'>
        <SideBarParent />
        <section className='content-container'>
          <div className="row">

            <Profile student={child.current} />


            {/* <div className="col-md-12 d-flex  mb-5 mt-3 ms-5">
              <img src="..." className="rounded-circle me-5" alt="..." />
              <h2>
                NATHAN FOLLIN
              </h2>
            </div>
            <div className="col-md-12 d-flex ps-5">
              <button type="button" className="btn btn-secondary me-5">Missing</button>
              <Link to={'/student/profil/presence'}>
                <button type="button" className="btn btn-secondary">Presence</button>
              </Link>

            </div>
            <div className="col-md-12">


              <div className="accordion " id="accordionPanelsStayOpenExample ">
                <div className="accordion-item w-75 m-auto mt-5 mb-5">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                      <strong className="m-auto ">Justified absences</strong>
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                    <div className="accordion-body">
                      RIEN
                    </div>
                  </div>
                </div>
                <div className="accordion-item w-75 m-auto mt-5">
                  <h2 className="accordion-header ">
                    <button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                      <strong className="m-auto"> Unjustified absences</strong>
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      RIENN
                    </div>
                  </div>
                </div>

              </div>


            </div> */}
          </div>

        </section>
      </div>

      <Footer />
    </div>
  )
}

export default ChildProfilePage