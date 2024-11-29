import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SidebarCoordinator from '../../components/SidebarCoordinator'
import { useAxios } from '../../Providers/AxiosProvider';
import { FallbackContent } from '../../components/FallbackContent';
import { Link } from 'react-router-dom';

function Classes() {
    const [classe, setClasse] = useState([]);

    const [loading, setLoading] = useState(true);  // État de chargement
    const { axios } = useAxios();
  
  
    function fetchClasses() {
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
  
      fetchClasses();
  
  
    }, [])
  
    if (loading) return <FallbackContent />;
  
    return (
      <div className='div-container d-flex flex-column'>
        <Navbar />
        <div className='body-content-container d-flex'>
          <SidebarCoordinator />
          <section className='content-container'>
  
            <div className="row">
              <div className="col-md-12  mb-4 mt-3 ms-5">
                <h1 className='py-3'>Classes</h1>
              </div>
              <div className="col-md-12 d-flex flex-wrap">
  
              {classe.map((classe, index) => {
                    return <div key={index} className="card shadow w-25 m-3" >
                      <Link to={`/coordinator/classes/infos/${classe.id}/${classe.label}`}>
                        <div className="card-body">
                          <p className="card-text"><strong>{classe.label}</strong> </p>
                        </div>
                      </Link>
                    </div>
  
                  })}
  
    
              </div>
  
            </div>
  
          </section>
        </div>
  
        <Footer />
      </div>
  
    )
  
    // return (
    //     <div className='div-container d-flex flex-column'>
    //         <Navbar />
    //         <div className='body-content-container d-flex'>
    //             <SidebarCoordinator />
    //             <section className='content-container'>

    //             <div className="row">
    //                     <div className="text-center mt-5 mb-5">
    //                         <h3>Classes: </h3>
    //                     </div>
    //                     <div className=" d-flex flex-wrap justify-content-between">


    //                         <div className="card w-25 shadow p-3 m-5 rounded" >
    //                             <img src="..." className="card-img-top" alt="..." />
    //                             <div className="card-body">
    //                                 <p className="card-text text-center">Timetables</p>
    //                             </div>
    //                         </div>


    //                         <div className="card w-25 shadow p-3 m-5 rounded" >
    //                             <img src="..." className="card-img-top" alt="..." />
    //                             <div className="card-body">
    //                                 <p className="card-text text-center">Students' list</p>
    //                             </div>
    //                         </div>


    //                         <div className="card w-25 shadow p-3 m-5 rounded" >
    //                             <img src="..." className="card-img-top" alt="..." />
    //                             <div className="card-body">
    //                                 <p className="card-text text-center">Modules</p>
    //                             </div>
    //                         </div>


    //                         <div className="card w-25 shadow p-3 m-5 rounded" >
    //                             <img src="..." className="card-img-top" alt="..." />
    //                             <div className="card-body">
    //                                 <p className="card-text text-center">Graphics</p>
    //                             </div>
    //                         </div>

    //                     </div>
    //                 </div>



    //             </section>
    //         </div>

    //         <Footer />
    //     </div>
    // )
}

export default Classes