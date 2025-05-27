import React from 'react';
//import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const handleSuccess = (credentialResponse) => {
    console.log('Token JWT:', credentialResponse.credential);

    // Aqui podes enviar o token para o backend
    // Ex: axios.post('/api/auth/google', { token: credentialResponse.credential })

    // Redireciona após login
    window.location.href = '/backoffice';
  };

  const handleError = () => {
    console.error('Erro no login com Google');
  };

  return (
    <div style={{ marginTop: '100px', textAlign: 'center' }}>
      <h2>Entrar no Paróquia Perto</h2>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default Login;
