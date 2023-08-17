import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import jwtServiceConfig from './jwtServiceConfig';

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  getAccessToken = () => {
    return window.localStorage.getItem('kohifEHR_access_token');
  };
  getUser = () => {
    return window.localStorage.getItem('kohifEHR_user');
  };
  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession(null,null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();
    const user = this.getUser();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(user,access_token);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null,null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  // createUser = (data) => {
  //   return new Promise((resolve, reject) => {
  //     axios.post(jwtServiceConfig.signUp, data).then((response) => {
  //       if (response.data.user) {
  //         this.setSession(response.data.access_token);
  //         resolve(response.data.user);
  //         this.emit('onLogin', response.data.user);
  //       } else {
  //         reject(response.data.error);
  //       }
  //     });
  //   });
  // };

  signInWithEmailAndPassword = (emailAddress, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${process.env.REACT_APP_API_URL}/Users/login`, { 
        emailAddress,
        password,
          
        })
        .then((response) => {
          console.log('Login Response: ',response.data)
          var res=response.data
          const newUser = {
            // uuid:'123',
            // from: 'custom-db',
            // password: '123',
            token:res.token,
            role: 'admin',
            data: {
              displayName:res.fullName,
              photoURL: 'assets/images/avatars/Abbott.jpg',
              email:res.email,
              // settings: {},
              // shortcuts: [],
            },
          }

          var data=newUser;
          console.log(data.token,'data ,,,,,,,') 
          if (data.token==undefined) {
            // this.emit('onAutoLogout', 'Invalid access_token');
          //  <p>hjdjakjdk</p>
          }else
          if (data) {
            this.setSession(JSON.stringify(data),data.token);
            resolve(data);
            this.emit('onLogin',data);
          } else {
            reject(response.data);
          }
        });
    });
  };

  signInWithToken = () => {
    console.log('signInWithToken')
    return new Promise((resolve, reject) => {
      var t=this.getAccessToken();
      if(t.length>0)
       {
        console.log('signInWithToken t: ' ,t)
        var user=this.getUser();
        this.setSession(user,t);
        console.log('signInWithToken user: ' ,user)
        resolve(user);
        // this.setSession(response.data.access_token);
      // resolve(response.data.user);
       }
      

      // axios
      //   .get(jwtServiceConfig.accessToken, {
      //     data: {
      //       access_token: this.getAccessToken(),
      //     },
      //   })
      //   .then((response) => {
      //     if (response.data.user) {
      //       this.setSession(response.data.access_token);
      //       resolve(response.data.user);
      //     } else {
      //       this.logout();
      //       reject(new Error('Failed to login with token.'));
      //     }
      //   })
      //   .catch((error) => {
      //     this.logout();
      //     reject(new Error('Failed to login with token.'));
      //   });
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (user,token) => {

    if (user && user!=null) {
      localStorage.setItem('kohifEHR_user', user);
      console.log('token:', token);
      localStorage.setItem('kohifEHR_access_token',  token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('kohifEHR_access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null,null);
    this.emit('onLogout', 'Logged out');
  };

  isAuthTokenValid = (access_token) => {
    console.log('isAuthTokenValid')
    if (!access_token) {
      return false;
    }
    var t=this.getAccessToken();
    console.log('isAuthTokenValid t:', t)
    if(t.length>0)
    return true;
    // const decoded = jwtDecode(access_token);
    // const currentTime = Date.now() / 1000;
    // if (decoded.exp < currentTime) {
    //   console.warn('access token expired');
    //   return false;
    // }
    return false;


    return true;
    
    return true;
  };

}

const instance = new JwtService();

export default instance;
