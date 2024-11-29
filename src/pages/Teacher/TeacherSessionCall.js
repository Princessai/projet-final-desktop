import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SidebarTeacher from '../../components/SidebarTeacher';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../Providers/AuthProvider';
import { FallbackContent } from '../../components/FallbackContent';
import { useAxios } from '../../Providers/AxiosProvider';
import '../../components/Navbar.css';
import { useForm } from 'react-hook-form';


function TeachersessionCall() {

  const { seance_id } = useParams();

  const { register, handleSubmit, formState, setValue, setError, clearErrors } = useForm();


  console.log('seance_id', seance_id)

  const attendanceFormRef = useRef();


  const [sessionStudents, setSessionStudents] = useState([]);
  const [loading, setLoading] = useState(true);  // État de chargement
  const { axios } = useAxios();


  // const { currentYear } = useAuth();


  function fetchSessionStudents() {
    console.log('fetch sessionStudents');
    axios.get(`/attendance-record/show/${seance_id}`)
      .then(function (response) {

        const sessionStudents = response.data;

        setSessionStudents((oldvalue) => sessionStudents);
        setLoading(false);
        console.log('sessionStudents inn fetchh', sessionStudents);

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });


  }


  useEffect(function () {

    fetchSessionStudents()


  }, [])



  if (loading) return <FallbackContent />;

  console.log('sessionStudents', sessionStudents)

  function onSubmit(data) {

    console.log('dataaaa', data)

  }

  return (
    <div className='div-container d-flex flex-column'>
      <Navbar />
      <div className='body-content-container d-flex'>
        <SidebarTeacher />
        <section className='content-container'>
          <div className="row">
            <div className="col-md-12 mt-3 ms-5">
              <h1 className='py-3'>SESSION : 9h-12h</h1>
            </div>
            <div className="col-md-12">

              <form className=" d-flex flex-column" ref={attendanceFormRef} onSubmit={handleSubmit(onSubmit)} >
                <div className="col-md-12 d-flex justify-content-end ">
                  <button type="submit" className="btn btn-success me-5 mb-5">END SESSION</button>
                </div>

                <table className="table shadow m-3">
                  <thead>
                    <tr>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      sessionStudents.map(function (student, index) {

                        let studentId = "student_" + student.id;

                        // console.log('last',student.lastname)
                        return <tr key={index}>
                          <div className='picture-container'>
                            <img src={student.picture} className='profile-picture' />
                          </div>

                          <td>
                            <div className='picture-container'>
                              <img src={student.picture} className='profile-picture ms-3' />
                            </div>

                          </td>
                          <td colSpan="2">{student.name} {student.lastname}</td>
                          <td className="d-flex justify-content-evenly">
                            <input className="form-check-input" type="radio" defaultValue='1' id={"flexRadioDefault2" + student.id} {...register(studentId, { required: true })} />
                            <label className="form-check-label" for={"flexRadioDefault2" + student.id}>
                              present
                            </label>

                            <input className="form-check-input" type="radio" defaultValue='-1' id={"flexRadioDefault3" + student.id} {...register(studentId, { required: true })} />
                            <label className="form-check-label" for={"flexRadioDefault3" + student.id}>
                              absent
                            </label>

                            <input className="form-check-input" type="radio" defaultValue='0' id={"flexRadioDefault4" + student.id} {...register(studentId, { required: true })} />
                            <label className="form-check-label" for={"flexRadioDefault4" + student.id}>
                              retard
                            </label>


                          </td>

                        </tr>


                      })

                    }




                    {/* <tr>
                    <th scope="row">1</th>
                    <td colSpan="2">Mark</td>
                    <td className="d-flex justify-content-evenly">
                      <button type="button" className="btn btn-warning">Danger</button>
                      <button type="button" className="btn btn-success">Danger</button>
                      <button type="button" className="btn btn-danger">Danger</button>
                    </td>

                  </tr> */}



                  </tbody>
                </table>
              </form>

            </div>
          </div>

        </section>
      </div>

      <Footer />
    </div>

  )
}

export default TeachersessionCall