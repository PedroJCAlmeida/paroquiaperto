 // src/components/Login.js (ou onde quer que seu componente Login esteja)

import React, { useState } from 'react'; // Importamos useState para gerir estados de carregamento e erro
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom'; // Importamos useNavigate e Link
import axios from 'axios'; // Importamos axios para fazer requisições HTTP

// Opcional: Crie um arquivo CSS para estilização
import '../styles/Login.css'; // Exemplo: src/styles/Login.css

const Login = () => {
  const navigate = useNavigate(); // Hook para navegar programaticamente
  const [loading, setLoading] = useState(false); // Estado para indicar que o login está a carregar
  const [error, setError] = useState(null);     // Estado para exibir mensagens de erro

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true); // Ativa o estado de carregamento
    setError(null);   // Limpa qualquer erro anterior

    try {
      const googleToken = credentialResponse.credential;
      console.log('Token JWT do Google (para enviar ao backend):', googleToken);

      // --- PASSO CRUCIAL: Enviar o token para o seu backend ---
      // IMPORTANTE: Altere 'http://localhost:8080/api/auth/google' para o URL real do seu backend
      // Certifique-se de que o seu backend Spring Boot tem um endpoint para processar este token.
      const backendResponse = await axios.post('http://localhost:8080/api/auth/google', {
        token: googleToken
      });

      console.log('Resposta do Backend (ex: token de sessão ou user info):', backendResponse.data);

      // Se o backend retornar um token de sessão ou dados do utilizador,
      // você pode guardá-lo no localStorage ou num Context/Redux para gerir a autenticação.
      // Exemplo: localStorage.setItem('authToken', backendResponse.data.sessionToken);

      // Redireciona para a página de backoffice após o login ser processado pelo backend
      navigate('/backoffice');

    } catch (err) {
      console.error('Erro ao processar login com Google no backend:', err);
      // Mensagem amigável para o utilizador em caso de falha no backend
      setError('Falha ao autenticar. Por favor, tente novamente.');
    } finally {
      setLoading(false); // Desativa o carregamento, independentemente do sucesso ou falha
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Erro no login com Google (ocorreu no frontend)');
    // Mensagem amigável para o utilizador em caso de falha no Google (ex: internet)
    setError('Não foi possível conectar com o Google. Verifique a sua conexão.');
  };

  return (
    <div className="login-container"> {/* Usamos uma classe para estilização */}
      <h2>Entrar no Paróquia Perto</h2>

      {/* Feedback para o utilizador */}
      {loading && <p className="loading-message">A iniciar sessão...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Botão de login do Google */}
      <div className="google-login-button-wrapper">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          // Algumas props úteis que pode adicionar:
          // useOneTap: true, // Para login 'one tap' automático se o utilizador já estiver logado
          // text: "continue_with", // Altera o texto do botão
          // size: "large", // Altera o tamanho do botão
        />
      </div>

      {/* Links opcionais para registo ou recuperação de senha */}
      <p>Ainda não tem conta? <Link to="/register">Registe-se aqui</Link></p>
      <p><Link to="/forgot-password">Esqueceu a sua palavra-passe?</Link></p>
    </div>
  );
};

export default Login;
