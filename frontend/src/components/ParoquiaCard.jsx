import React from 'react';
import '../styles/ParoquiaCard.css'; 
import { MapPin } from 'lucide-react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ParoquiaCard({ dados }) {
  const MySwal = withReactContent(Swal);
  const handleClick = () => {
  const { nome, imagem, endereco, distancia, horarios, descricao, contato, email, site, whatsapp, instagram, facebook } = dados;

    const html = `
      
      ${imagem ? `<img src="${imagem}" alt="${nome}" />` : ''}
      ${endereco ? `<p><strong>Endereço:</strong> ${endereco}</p>` : ''}
      ${distancia ? `<p><strong>Distância:</strong> ${distancia} km</p>` : ''}
      ${horarios ? `<p><strong>Horários:</strong></p><p>${horarios.join('<br>')}</p>` : ''}
      ${descricao ? `<p><strong>Descrição:</strong> ${descricao}</p>` : ''}
      ${contato ? `<p><strong>Contato:</strong> ${contato}</p>` : ''}
      ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}" style="color: #545454; text-decoration: none;">${email}</a></p>` : ''}
      ${site ? `<p><strong>Site:</strong> <a href="${site}" target="_blank" style="color: #545454; text-decoration: none;">${site}</a></p>` : ''}
      
      ${(whatsapp || instagram || facebook) ? `<p><strong>Redes sociais:</strong></p>
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 10px;">` : ''}

        ${whatsapp ? `
          <div>
            <a href="https://api.whatsapp.com/send?phone=${whatsapp}" target="_blank" style="text-decoration: none; cursor: pointer;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 30px; height: 30px; margin-right: 10px;" />
            </a>
          </div>` : ''}
          
        ${instagram ? `
          <div>
            <a href="${instagram}" target="_blank" style="text-decoration: none; cursor: pointer;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style="width: 30px; height: 30px; margin-right: 10px;" />
            </a>
          </div>` : ''}

        ${facebook ? `
          <div>
            <a href="${facebook}" target="_blank" style="text-decoration: none; cursor: pointer;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style="width: 30px; height: 30px; margin-right: 10px;" />
            </a>
          </div>` : ''}

      ${(whatsapp || instagram || facebook) ? `</div>` : ''}

      <p>mais informações em breve...</p>
    `;

      MySwal.fire({
        title: <strong>{nome}</strong>,
        html,
        confirmButtonText: 'Fechar'
      });

    };


  return (
    <>
   
   
    <div className="paroquia-card">

      <div className="paroquia-card-interno">
        <h3>{dados.nome}</h3> 
        <p><MapPin size={16} /> {dados.endereco}</p>

        
        {dados.distancia && dados.distancia !== '-' && (
          <span className="paroquia-distancia">{dados.distancia} km</span>
        )}

        <p><span className="paroquia-horario-label">Horários: </span></p>
        {
          dados.horarios.map((horario, index) => (
            <p key={index} className="paroquia-horario">{horario}</p>
          ))
        }
      </div>

      <div className='saberMaisAreaButton'>
        <div className='saberMais'>
            <button className="saberMais-button" onPointerDown={handleClick}>Ver mais</button>
        </div>
      </div>
     

    </div>
   
    </>
  );
}
