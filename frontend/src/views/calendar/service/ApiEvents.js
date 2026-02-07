

import axios from 'axios';

const apiURL = 'http://localhost:5000/calendar/events';

export async function createEvent(eventData, config) {
  return await axios.post(`${apiURL}`, eventData, config);
}

export async function getAllEvents(config) {
  return await axios.get(`${apiURL}`, config);
}

export async function getEventById(eventId, config) {
  return await axios.get(`${apiURL}/${eventId}`, config);
}

export async function updateEvent(eventId, eventData, config) {
  return await axios.put(`${apiURL}/${eventId}`, eventData, config);
}

export async function deleteEvent(eventId, config) {
  return await axios.delete(`${apiURL}/${eventId}`, config);
}
