import FuseUtils from '@fuse/utils';
import AppContext from 'app/AppContext';
import { Component } from 'react';
import { matchRoutes } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import history from '@history';

let loginRedirectUrl = null;

class FuseAuthorization extends Component {
  constructor(props, context) {
    super(props);
    const { routes } = context;
    console.log('routes_______',routes)
    this.state = {
      accessGranted: true,
      routes,
    };
    this.defaultLoginRedirectUrl = props.loginRedirectUrl || '/';
  }

  componentDidMount() {
    console.log('componentDidMount t:',this.state.accessGranted )
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.accessGranted !== this.state.accessGranted;
  }

  componentDidUpdate() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { location, userRole } = props;
    const { pathname } = location;
    
    console.log('getDerivedStateFromProps+props__________',props)
    const matchedRoutes = matchRoutes(state.routes, pathname);
    const matched = matchedRoutes ? matchedRoutes[0] : false;
    console.log('matchedRoutes__________',matchedRoutes)
    console.log('accessGranted__________',matched)
    console.log('userRole__________',userRole)
    return {
      accessGranted: matched ? FuseUtils.hasPermission(matched.route.auth, userRole) : false,
    };
  }

  redirectRoute() {
    const { location, userRole } = this.props;
    const { pathname } = location;
    const redirectUrl = loginRedirectUrl || this.defaultLoginRedirectUrl;
    console.log('redirectRoute t:',redirectUrl ) 
    console.log('userRole---------',userRole ) 
    
    /*
        User is guest
        Redirect to Login Page
        */
    if (!userRole || userRole.length === 0) {
      console.log('sign-in:     :',pathname )
      setTimeout(() => history.push('/sign-in'), 0);
      loginRedirectUrl = pathname;
    } else {
      console.log('redirectRoute>>> to redirectURL: ',redirectUrl )
      /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or loginRedirectUrl
        */
      setTimeout(() => history.push(redirectUrl), 0);
      loginRedirectUrl = this.defaultLoginRedirectUrl;
    }
  }

  render() {
    // console.info('Fuse Authorization rendered', this.state.accessGranted);
    return this.state.accessGranted ? <>{this.props.children}</> : null;
  }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(FuseAuthorization);
