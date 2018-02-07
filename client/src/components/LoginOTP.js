// create a functional component

import React from 'react'
import { Button, Form } from 'semantic-ui-react'

const LoginOTP = () => (
  <Form>
    <Form.Field>
      <label>QR Number</label>
      <input placeholder='000000' />
    </Form.Field>
    <Button type='submit'>Submit</Button>
  </Form>
)

export default LoginOTP