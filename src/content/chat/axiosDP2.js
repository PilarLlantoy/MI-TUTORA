import axios from 'axios'

const axiosDP2 = axios.create({
  baseURL: 'http://ec2-54-210-61-246.compute-1.amazonaws.com:8080/',
  timeout: 1000,
  headers: {'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1MCIsImlhdCI6MTY2NjU2MzczMiwic3ViIjoiYTIwMjcyNDQ4QHB1Y3AuZWR1LnBlIiwiaXNzIjoiTWFpbiIsImV4cCI6MTY2OTQ5MTczMn0.ro0r5PI39iiRy5pDLNkKfz4h9G5j91aYvFxVp502E-Y'}
});

export default axiosDP2;