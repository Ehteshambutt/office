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
    this.state = {
      accessGranted: true,
      routes,
    };
    this.defaultLoginRedirectUrl = props.loginRedirectUrl || '/';
  }

  componentDidMount() {
    console.log('componentDidMount___________ +++++++++++++',this.state.accessGranted)
    
    if (!this.state.accessGranted) {
    console.log('componentDidMount_____________________________________________')
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
    
    console.log('getDerivedStateFromProps_______________________________')
    const { location, userRole } = props;
    const { pathname } = location;

    const matchedRoutes = matchRoutes(state.routes, pathname);

    const matched = matchedRoutes ? matchedRoutes[0] : false;
    return {
      accessGranted:  matched ? FuseUtils.hasPermission(matched.route.auth, userRole) : true,
    };
  }

  redirectRoute() {
    const { location, userRole } = this.props;
    const { pathname } = location;
    const redirectUrl =  loginRedirectUrl || this.defaultLoginRedirectUrl;
    this.defaultLoginRedirectUrl=redirectUrl
    console.log('this.defaultLoginRedirectUrl@@@@@@@@@@@@@@',this.props.children)
    console.log('userRole@@@@@@@@@@@@@@',userRole)
    setTimeout(() => history.push(redirectUrl), 0);
    // loginRedirectUrl = 'example';
    /*
        User is guest
        Redirect to Login Page
        */
    // if (!userRole || userRole.length === 0) {
    //   console.log('cuserRole+++++++++++++++++++++++')
    //   setTimeout(() => history.push('/sign-in'), 0);
    //   loginRedirectUrl = pathname;
    // } else {
    //   console.log('userRole_____________________________________________')
    //   /*
    //     User is member
    //     User must be on unAuthorized page or just logged in
    //     Redirect to dashboard or loginRedirectUrl
    //     */
    //   setTimeout(() => history.push(redirectUrl), 0);
    //   loginRedirectUrl = this.defaultLoginRedirectUrl;
    // }
  }

  render() {
    console.log('render_______________________________',this.props.children)
    // console.info('Fuse Authorization rendered', this.state.accessGranted);
    return this.state.accessGranted ? <>{this.props.children}</> : null;
  }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(FuseAuthorization);
