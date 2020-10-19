import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus, FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import '../styles/pages/create-orphanage.css';
import Sidebar from '../components/Sidebar';
import happyMapIcon from '../utils/mapIcon';
import api from '../services/api';
import { useToasts } from 'react-toast-notifications';

export default function CreateOrphanage() {
  const history = useHistory();
  const { addToast } = useToasts();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function removeImage(position: number) {
    setImages(images.filter((image, index) => index !== position));
    setPreviewImages(previewImages.filter((url, index) => index !== position));
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (images.length === 6) return;
    if (!event.target.files) return;

    const selectedImages = Array.from(event.target.files);
    setImages([...images, ...selectedImages]);

    const selectedImagesPreview = selectedImages.map((image) => {
      return URL.createObjectURL(image);
    });

    setPreviewImages([...previewImages, ...selectedImagesPreview]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { latitude, longitude } = position;
    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', openingHours);
    data.append('open_on_weekends', String(openOnWeekends));
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));

    images.forEach((image) => {
      data.append('images', image);
    });

    await api.post('orphanages', data);
    addToast('Orfanato cadastrado com sucesso', { appearance: 'success' });
    history.push('/app');
  }

  return (
    <div id='page-create-orphanage'>
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className='create-orphanage-form'>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-3.8265665, -38.4744683]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={happyMapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <div className='input-block'>
              <label htmlFor='name'>Nome</label>
              <input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='input-block'>
              <label htmlFor='about'>
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id='name'
                maxLength={300}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div className='input-block'>
              <label htmlFor='images'>
                Fotos <span>Máximo de 6 fotos</span>
              </label>

              <div className='images-container'>
                {previewImages.map((image, index) => (
                  <div key={image} className='preview-item'>
                    <img src={image} alt={name} />
                    <button type='button' onClick={() => removeImage(index)}>
                      <FiX size={24} color='#FF669D' />
                    </button>
                  </div>
                ))}
                <label htmlFor='image' className='new-image'>
                  <FiPlus size={24} color='#15b6d6' />
                </label>
              </div>

              <input
                onChange={handleSelectImages}
                type='file'
                id='image'
                multiple
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className='input-block'>
              <label htmlFor='instructions'>Instruções</label>
              <textarea
                id='instructions'
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <div className='input-block'>
              <label htmlFor='opening_hours'>Horário de Funcionamento</label>
              <input
                id='opening_hours'
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />
            </div>

            <div className='input-block'>
              <label htmlFor='open_on_weekends'>Atende fim de semana</label>

              <div className='button-select'>
                <button
                  type='button'
                  className={openOnWeekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  className={!openOnWeekends ? 'active' : ''}
                  type='button'
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className='confirm-button' type='submit'>
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}
