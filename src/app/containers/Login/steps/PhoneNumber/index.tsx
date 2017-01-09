import * as React from 'react';
import { connect } from 'react-redux';
import { sendCode } from 'api/auth';
const s = require('./style.css');
const t = require('../../style.css');

interface IConnectedState {
  auth: any;
}

interface IConnectedActions {
  dispatch: any;
}

interface IOwnProps {
  form: any;
  update: any;
  nextStep: any;
}

type IProps = IConnectedState & IConnectedActions & IOwnProps;

interface IState {
  phoneCode?: string;
  phoneNumber?: string;
  error?: any;
}

class PhoneNumberImpl extends React.Component<IProps, IState> {
  public state = {
    phoneCode: '+7',
    phoneNumber: '',
    error: null,
  };

  private handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  public handleNextStep = () => {
    const { dispatch, nextStep, update } = this.props;
    const phoneNumber = this.state.phoneCode + this.state.phoneNumber;

    update({ phoneNumber });
    dispatch(sendCode(phoneNumber))
      .then(({payload: error}) => error.error_code ? this.setState({ error }) : this.setState({error: null}))
      .then(() => this.state.error || nextStep());
  }

  public render() {
    const { error } = this.state;

    return (
      <div className={t.loginStep}>
        <h1>Your Phone</h1>
        <p>
          Please confirm your country code and enter your phone number.
        </p>
        <div className={`row ${t.formGroupLogin}`}>
          <input
            onChange={this.handleChange}
            name="phoneCode"
            className={`${s.phoneCode} col-xs-2 form-control form-control-lg`}
            value={this.state.phoneCode} type="tel" />
          <input
            onChange={this.handleChange}
            name="phoneNumber"
            className="col-xs-10 form-control form-control-lg"
            placeholder="--- --- -- --" type="tel" />
        </div>
        {error && <div>Error type: {error.error_message}</div>}
        <button onClick={this.handleNextStep} className={`${t.btn} ${t.primary}`}>Next</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({ auth: state.auth });
const PhoneNumber = connect<IConnectedState, IConnectedActions, IOwnProps>(mapStateToProps)(PhoneNumberImpl);

export { PhoneNumber }
