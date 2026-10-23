import { Link } from 'react-router-dom';
import '../styles/cards.css';

export default function ServiceCard({ title, subtitle, image, link, price, rating }) {
    return (
        <div className="service-card">
            {image && <img src={image} alt={title} className="service-img" />}
            <div className="service-info">
                <h3>{title}</h3>
                <p className="subtitle">{subtitle}</p>
                <div className="service-meta">
                    {price && <span className="price">₹{price}</span>}
                    {rating && <span className="rating">⭐ {rating}</span>}
                </div>
                <Link to={link} className="btn-view">View Details</Link>
            </div>
        </div>
    );
}
