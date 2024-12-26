import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../Providers/AuthProvider';
import { useAxios } from '../../Providers/AxiosProvider';
import { FallbackContent } from '../../components/FallbackContent';
import style from './ParentChoicePage.module.css';
import { Link } from 'react-router-dom';
import { useChild } from '../../Providers/ChildProvider';


function ParentChoicePage() {


  const { user, isUserAuthenticated } = useAuth();
  console.log('userrrr parenttt', user);

  // return;

  const [parentsChildren, setParentsChildren] = useState([]);  // État de chargement
  const [loading, setLoading] = useState(true);  // État de chargement
  const { axios } = useAxios();

  const { setSelectedChild } = useChild();


  function fetchParentsChildren() {
    console.log('fetch childrennn');
    axios.get(`/list/parent/children/${user.id}`)
      .then(function (response) {

        const children = response.data;
        setParentsChildren((oldvalue) => [...children]);
        setLoading(false);
        console.log(children);

      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });


  }


  useEffect(function () {

    if (isUserAuthenticated) {
      fetchParentsChildren();

    }



  }, [isUserAuthenticated])

  if (loading) return <FallbackContent />;



  return (
    <div className='div-container d-flex flex-column'>
      <Navbar />
      <div className='body-content-container d-flex'>
        <section className='content-container'>
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center mt-5 mb-5">
              <h3>Your child(ren): </h3>
            </div>
            <div className="col-md-12 d-flex flex-wrap justify-content-center ">

              {parentsChildren.map((child, index) => {
                return <div key={index} className="card w-25 shadow p-3 m-3 rounded" >
                  <Link to={ `/parent/child/profil/${child.id}`}
                  state= {{child}}
                  onClick={() => setSelectedChild(child)}
                  >

                    <div className={`card-img-top-container ${style['card-img-top-container']}`}>
                      <img src={child.picture} className={`card-img-top ${style['card-img-top']}`} alt="child picture" />

                    </div>
                    <div className="card-body">
                      <p className="card-text text-center">{child.name} {child.lastname}</p>
                      <p className="card-text text-center">{child.classe[0].label}</p>
                    </div>

                  </Link>
                </div>

                // `/student/profil/${child.id}`

              })}


              {/* <div className="card w-25 shadow p-3  rounded" >
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                  <p className="card-text text-center">NICOLAS LOTTIN B3 DEV</p>
                </div>
              </div> */}


              {/* <div className="card w-25 shadow p-3  rounded" >
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                  <p className="card-text text-center">NICOLAS LOTTIN B3 DEV</p>
                </div>
              </div>


              <div className="card w-25 shadow p-3  rounded" >
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                  <p className="card-text text-center">NICOLAS LOTTIN B3 DEV</p>
                </div>
              </div> */}

            </div>
          </div>

        </section>
      </div >

      <Footer />
    </div >

  )
}

export default ParentChoicePage