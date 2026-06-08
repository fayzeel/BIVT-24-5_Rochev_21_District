import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

function Events() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    event_date: '',
    description: '',
    district_id: ''
  });

  useEffect(() => {
    loadEvents();
    loadDistricts();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await axios.get('/api/event');
      setEvents(response.data);
    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
    }
  };

  const loadDistricts = async () => {
    try {
      const response = await axios.get('/api/district');
      setDistricts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки районов:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      event_date: '',
      description: '',
      district_id: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      event_date: event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '',
      description: event.description || '',
      district_id: event.district?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это событие?')) {
      try {
        await axios.delete(`/api/event/${id}`);
        loadEvents();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить событие');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        district_id: formData.district_id ? parseInt(formData.district_id) : null
      };

      if (editingEvent) {
        await axios.put(`/api/event/${editingEvent.id}`, data);
      } else {
        await axios.post('/api/event', data);
      }
      
      setIsModalOpen(false);
      loadEvents();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить событие');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">События</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Поиск по названию или описанию..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {isAdmin && (
        <button className="btn btn-primary" onClick={handleAdd}>
          + Добавить событие
        </button>
      )}

      <div className="cards-grid" style={{ marginTop: '1.5rem' }}>
        {filteredEvents.map(event => (
          <div key={event.id} className="card">
            <h3 className="card-title">{event.name}</h3>
            <p className="card-text">
              <strong>Дата:</strong> {formatDate(event.event_date)}
            </p>
            <p className="card-text">
              <strong>Район:</strong> {event.district?.name || '—'}
            </p>
            {event.description && (
              <p className="card-text">{event.description}</p>
            )}
            {isAdmin && (
              <div className="actions" style={{ marginTop: '1rem' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handleEdit(event)}
                >
                  Изменить
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(event.id)}
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="empty-state">
          <p>События не найдены</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Редактировать событие' : 'Добавить событие'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Название *</label>
            <input
              type="text"
              className="form-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Дата события *</label>
            <input
              type="date"
              className="form-input"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Район</label>
            <select
              className="form-input"
              name="district_id"
              value={formData.district_id}
              onChange={handleChange}
            >
              <option value="">Не выбран</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              className="form-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEvent ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Events;