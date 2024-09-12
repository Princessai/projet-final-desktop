export const routeRegister = {

    actions: {
        login: "/login",

    },

    getRoute(route) {
        console.log(this.actions);
        if (!this.actions[route]) {
            throw new Error("custom route don't exist")
        }
        return this.actions[route];
    },

    setRoute(path, name = null) {
        if (name == null) {
            console.log('null')
            this.actions[path] = path;
        } else {
           
            this.actions[name] = path;
        }

    }
}



routeRegister.setRoute("/", "index");
routeRegister.setRoute("/student/home", "studentHome");
routeRegister.setRoute("/student/timetable", "studentTimetable");
routeRegister.setRoute("/student/profil/presence", "studentProfilPresence");
routeRegister.setRoute("/student/profil", "studentProfil")
routeRegister.setRoute("/student/missing","studentMissing")
routeRegister.setRoute("/student/presence","studentPresence")
routeRegister.setRoute("/student/presence/details","studentPresenceDetails")
routeRegister.setRoute("/parent/home","parenthome") // home parent
routeRegister.setRoute("/teacher/home","teacherhome")
routeRegister.setRoute("/teacher/session/call","teacherSessionCall")
routeRegister.setRoute("coordinator/graphic","coordinatorGraphic")
routeRegister.setRoute("coordinator/graphic/class","coordinatorGraphicClass")
routeRegister.setRoute("coordinator/graphic/class/details","coordinatorGraphicClassDetails")
routeRegister.setRoute("/coordinator/home","coordinatorhome")
routeRegister.setRoute("/coordinator/timetable/class","coordinatorTimetableClass")
routeRegister.setRoute("/coordinator/add-timetable", "coordinatoradd-timetable")
routeRegister.setRoute("/coordinator/timetable/class/pastimetable","coordinatorTimetableClassPastimetable")
routeRegister.setRoute("/coordinator/timetable/class/Upcomingimetable","coordinatorTimetableClassUpComingTimetable")
routeRegister.setRoute("/coordinator/user","coordinatorUser")
routeRegister.setRoute("/coordinator/userClass","coordinatorUserClass")
routeRegister.setRoute("/coordinator/userClass/profil","coordinatoruserClassprofil")
routeRegister.setRoute("/coordinator/userClass/profil/presence","coordinatoruserClassProfilPresence")
routeRegister.setRoute("/coordinator/call","coordinatorCall")
routeRegister.setRoute("/coordinator/call/session","coordinatorCallSession")



console.log('routerrrrrrjjjsss');