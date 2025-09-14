import React from 'react'
import { useParams } from 'react-router-dom'

const ParoquiaDetalhe = () => {
  const { id } = useParams();
  const [paroquia, setParoquia] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/paroquias/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Paróquia não encontrada');
        return res.json();
      })
      .then(data => {
        setParoquia(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (error) return <div className="p-6 text-red-600">Erro: {error}</div>;
  if (!paroquia) return <div className="p-6">Paróquia não encontrada.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">{paroquia.nome}</h2>
      {paroquia.imagem && (
        <img src={paroquia.imagem} alt={paroquia.nome} className="mb-4 rounded shadow" style={{ maxWidth: '100%' }} />
      )}
      <p className="text-gray-700 mb-2"><strong>Endereço:</strong> {paroquia.endereco}</p>
      <p className="text-gray-700 mb-2"><strong>Descrição:</strong> {paroquia.descricao}</p>
      <p className="text-gray-700 mb-2"><strong>Telefone:</strong> {paroquia.telefone}</p>
      <p className="text-gray-700 mb-2"><strong>Email:</strong> {paroquia.email}</p>
      <p className="text-gray-700 mb-2"><strong>Site:</strong> <a href={paroquia.site} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{paroquia.site}</a></p>
      <p className="text-gray-700 mb-2"><strong>Whatsapp:</strong> {paroquia.whatsapp}</p>
      <div className="mb-2">
        <strong>Redes sociais:</strong>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          {paroquia.instagram && <a href={paroquia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600">Instagram</a>}
          {paroquia.facebook && <a href={paroquia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600">Facebook</a>}
        </div>
      </div>
      <div className="mb-2">
        <strong>Horários:</strong>
        <ul className="list-disc ml-6">
          {paroquia.horarios && paroquia.horarios.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
      <p className="text-gray-500 mt-4">ID: {paroquia.id}</p>
    </div>
  );
}

export default ParoquiaDetalhe
