// create a functional component

import React from 'react'
import { Button, Form } from 'semantic-ui-react'

const LoginOTP = () => (
  <Form>
    <Form.Field>
      <label>Number</label>
      <input placeholder='First Name' />
    </Form.Field>
    <Button type='submit'>Submit</Button>
  </Form>
)

export default LoginOTP