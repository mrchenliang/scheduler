export function getAppointmentsForDay(state, day) {
  let result = [];
  for (let i = 0; i < state.days.length; i++) {
    if (state.days[i].name === day) {
      result = state.days[i].appointments;
    }
  }
  for (const appointment in state.appointments) {
    for (let i = 0; i < result.length; i++){
      if(result[i]===state.appointments[appointment].id) {
        result[i]=state.appointments[appointment];
      }
    }
  }
  return result;
} 

export function getInterview(state, interview) {
  if(!interview){
    return null;
  }
  let id = interview.interviewer;
  let student = interview.student;
  for (const interviewer in state.interviewers) {
    if (id === state.interviewers[interviewer].id) {
      return {
        interviewer: state.interviewers[interviewer], 
        student: student
      };
    }
  }
} 