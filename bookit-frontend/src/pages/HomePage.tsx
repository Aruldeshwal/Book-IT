import React, { useState, useEffect } from 'react';
import { fetchExperiences} from '../api/apiService';
import type { Experience } from '../api/apiService';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await fetchExperiences();
        setExperiences(data);
      } catch (err) {
        setError('Failed to fetch experiences. The catalogue is momentarily misplaced.');
      } finally {
        setLoading(false);
      }
    };
    loadExperiences();
  }, []);

  if (loading) return <div className="text-center text-lg">Loading experiences... A moment, please.</div>;
  if (error) return <div className="text-center text-red-600 text-lg">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <h2 className="col-span-full text-3xl font-semibold mb-4">Our Distinguished Offerings</h2>
      {experiences.map((exp) => (
        <div key={exp._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
          <img src={exp.image} alt={exp.title} className="w-full h-48 object-cover"/>
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800">{exp.title}</h3>
            <p className="text-lg text-indigo-600 font-semibold mt-1">${exp.price} / {exp.duration}</p>
            <Link to={`/experience/${exp._id}`} className="mt-3 block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
              View Details, Sir
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;