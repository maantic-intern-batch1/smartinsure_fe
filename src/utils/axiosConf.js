import axios from 'axios';

const axiosInstance = axios.create({
  validateStatus: function (_) {
    return true;
  },
});

export default axiosInstance
