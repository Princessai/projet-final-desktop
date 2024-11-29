import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SidebarCoordinator from "../../components/SidebarCoordinator";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAxios } from "../../Providers/AxiosProvider";
import { FallbackContent } from "../../components/FallbackContent";
import "./call.css";
import dayjs from "dayjs";

function CoordinatorsessionCall() {
  const { mode, seance_id, seance_classe, heure_debut, heure_fin } = useParams();

  console.log(mode);

  const { register, handleSubmit, formState, setValue, setError, clearErrors } = useForm();

  let seanceStart = dayjs(heure_debut).format("HH:mm");
  let seanceEnd = dayjs(heure_fin).format("HH:mm");

  console.log("seance_id", seance_id);

  const attendanceFormRef = useRef();


  const [sessionStudents, setSessionStudents] = useState([]);
  const [loading, setLoading] = useState(true); // État de chargement
  const { axios } = useAxios();

  const [selectedValue, setSelectedValue] = useState(null); // Stocke la valeur sélectionnée


  const handleSelection = (value) => {
    setSelectedValue(value); // Met à jour la valeur sélectionnée
  };

  // const { currentYear } = useAuth();

  function fetchStudentsAttendanceRecord() {
    console.log("fetch sessionStudents");
    axios
      .get(`/attendance-record/${mode}/${seance_id}`)
      .then(function (response) {
        const sessionStudents = response.data;

        setSessionStudents((oldvalue) => sessionStudents);
        setLoading(false);
        console.log("sessionStudents inn fetchh", sessionStudents);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  // function showClassAttendanceRecord(){}


  useEffect(function () {
    fetchStudentsAttendanceRecord();
  }, []);

  // if (mode == 'edit') {
  //   sessionStudents.forEach((student)=>{

  //   })
  // }

  if (loading) return <FallbackContent />;

  console.log("sessionStudents", sessionStudents);

  function onSubmit(data) {
    console.log("dataaaa", data);

    const attendancesData = sessionStudents.map((student) => {
      return {
        id: student.id,
        isDropped: student.isDropped,
        status: data[`student_${student.id}`],
      };
    });
    console.log('attendancesArray', attendancesData);


    let action = mode == 'edit' ? 'update' : 'create';

    axios
      .post(`/attendance-record/${action}/${seance_id}`, { attendances: attendancesData })
      .then((response) => {
        console.log(response.message);
      })
      .catch((error) => {
        console.error("Error making attendance:", error);
      });
  }

  return (
    <div className="div-container d-flex flex-column">
      <Navbar />
      <div className="body-content-container d-flex">
        <SidebarCoordinator />
        <section className="content-container">
          <div className="m-3">
            <div className="title-container col-md-12 mt-3 ms-3">
              <p className="py-3 fs-3">
                <span className="fw-bold">Session: </span>
                {seanceStart}-{seanceEnd} {seance_classe}
              </p>
            </div>
            <div className="col-md-12">
              <form
                className=" d-flex flex-column"
                ref={attendanceFormRef}
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="col-md-12 d-flex justify-content-end ">
                  <button type="submit" className="btn btn-success me-5 mb-5">
                    END SESSION
                  </button>
                </div>

                <div className="table shadow">
                  <div>
                    {sessionStudents.map(function (student, index) {
                      let studentId = "student_" + student.id;

                      // console.log('last',student.lastname)
                      return (
                        <div
                          className="d-flex align-items-center p-3"
                          key={index}
                        >
                          <div className="fw-bold"> {index + 1}</div>
                          <div className="d-flex justify-content-between align-items-center w-100 border-bottom">
                            {/* <div className='picture-container'>
                              <img src={student.picture} className='profile-picture ' />
                            </div> */}

                            <div colSpan="2">
                              {student.name} {student.lastname}
                            </div>
                            <div className="d-flex justify-content-between w-50 ">


                              <div>
                                <label
                                  className="form-check-label text-success fw-bold"
                                  htmlFor={"flexRadioDefault2" + student.id}
                                >
                                  <input
                                    className="form-check-input present me-2 border-success"
                                    type="radio"
                                    defaultValue="1"
                                                                        
                                    id={"flexRadioDefault2" + student.id}
                                    {...register(studentId, { required: true })}
                                  />
                                  present
                                </label>
                              </div>




                              <div>
                                <label
                                  className="form-check-label text-warning fw-bold"
                                  htmlFor={"flexRadioDefault3" + student.id}
                                >
                                  <input
                                    className="form-check-input late me-2 border-warning"
                                    type="radio"
                                    defaultValue="-1"
                                    
                                    id={"flexRadioDefault3" + student.id}
                                    {...register(studentId, { required: true })}
                                  />
                                  late
                                </label>
                              </div>





                              <div>
                                <label
                                  className="form-check-label text-danger fw-bold"
                                  htmlFor={"flexRadioDefault4" + student.id}
                                >
                                  <input
                                    className="form-check-input absent me-2 border-danger"
                                    type="radio"
                                    defaultValue="0"
                                    
                                    id={"flexRadioDefault4" + student.id}
                                    {...register(studentId, { required: true })}
                                  />
                                  absent
                                </label>
                              </div>


                              
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* <tr>
                    <th scope="row">1</th>
                    <td colSpan="2">Mark</td>
                    <td className="d-flex justify-content-evenly">
                      <button type="button" className="btn btn-warning">Danger</button>
                      <button type="button" className="btn btn-success">Danger</button>
                      <button type="button" className="btn btn-danger">Danger</button>
                    </td>

                  </tr> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );

  // return (
  //   <div className='div-container d-flex flex-column'>
  //     <Navbar />
  //     <div className='body-content-container d-flex'>
  //       <SidebarCoordinator />
  //       <section className='content-container'>
  //         <div class="row">
  //           <div class="col-md-12 mt-3 ms-5">
  //             <h1 class='py-3'>SESSION : 9h-12h</h1>
  //           </div>
  //           <div class="col-md-12 d-flex justify-content-end ">
  //             <button type="button" class="btn btn-success me-5 mb-5">END SESSION</button>
  //           </div>
  //           <div class="col-md-12">
  //             <table class="table shadow m-3">
  //               <thead>
  //                 <tr>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 <tr>
  //                   <th scope="row">1</th>
  //                   <td colspan="2">Mark</td>
  //                   <td class="d-flex justify-content-evenly">
  //                     <button type="button" class="btn btn-warning">Danger</button>
  //                     <button type="button" class="btn btn-success">Danger</button>
  //                     <button type="button" class="btn btn-danger">Danger</button>
  //                   </td>

  //                 </tr>
  //                 <tr>
  //                   <th scope="row">2</th>
  //                   <td colspan="2">Jacob</td>
  //                   <td class="d-flex justify-content-evenly">
  //                     <button type="button" class="btn btn-warning">Danger</button>
  //                     <button type="button" class="btn btn-success">Danger</button>
  //                     <button type="button" class="btn btn-danger">Danger</button>
  //                   </td>

  //                 </tr>
  //                 <tr>
  //                   <th scope="row">3</th>
  //                   <td colspan="2">Larry the Bird</td>
  //                   <td class="d-flex justify-content-evenly">
  //                     <button type="button" class="btn btn-warning">Danger</button>
  //                     <button type="button" class="btn btn-success">Danger</button>
  //                     <button type="button" class="btn btn-danger">Danger</button>
  //                   </td>
  //                 </tr>
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>

  //       </section>
  //     </div>

  //     <Footer />
  //   </div>

  // )
}

export default CoordinatorsessionCall;
