import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import themes from '@src/utils/themes';
import LayoutField from '@src/components/layouts/layout-field';
import Input from '@src/components/elements/input';
import Error from '@src/components/elements/error';
// import Button from '@src/components/elements/button';

import './style.less';
import {Form, Button, Checkbox} from 'antd';

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
};

class FormLogin extends Component {
  static propTypes = {
    data: PropTypes.shape({
      login: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }).isRequired,
    errors: PropTypes.any,
    wait: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    data: {},
    theme: ['default'],
    errors: {},
    onChange: () => {    },
    onSubmit: () => {    },
  };

  onChange = name => value => {
    const {data, onChange} = this.props;
    onChange({...data, [name]: value});
  };

  onSubmit = e => {
    const {data, onSubmit} = this.props;
    e.preventDefault();
    onSubmit(data);
  };

  render(){
    const {data, errors, wait, theme} = this.props;
    return (
      <form className={themes('FormLogin', theme)} onSubmit={this.onSubmit}>
        <LayoutField
          label={'Логин'}
          input={<Input type="text" value={data.login} onChange={this.onChange('login')} />}
          error={<Error errors={errors} path={'login'} />}
        />
        <LayoutField
          label={'Пароль'}
          input={
            <Input type="password" value={data.password} onChange={this.onChange('password')} />
          }
          error={<Error errors={errors} path={'password'} />}
        />
        <LayoutField
          input={
            <Button type="primary" htmlType="submit" loading={wait} disabled={wait}>
              Войти{wait && '...'}
            </Button>
          }
          error={<Error errors={errors} path={''} />}
        />
      </form>
    );
  }
}

/**
 *
 */

export default FormLogin;
