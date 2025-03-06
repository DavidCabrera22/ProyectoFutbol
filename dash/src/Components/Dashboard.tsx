import { FC } from 'react';

interface Project {
  id: number;
  title: string;
  image: string;
}

const Dashboard: FC = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "Technology behind the Blockchain",
      image: "/img/blockchain.webp"
    },
    {
      id: 2,
      title: "Greatest way to a good Economy",
      image: "/img/pngtree-hand-drawn-boy-in-business.jpg"
    },
    {
      id: 3,
      title: "Most essential tips for Burnout",
      image: "/img/3067287.png"
    }
  ];

  return (
    <div className="p-4">
      <div className="bg-white rounded-3 p-4 mb-4">
        <h1>Hola Jorge 👋</h1>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
            <div className="position-relative">
                <img src="/img/banner.jpg" className="w-100 rounded-3" alt="Profile Banner" style={{height: '120px', objectFit: 'cover'}} />
                <div className="position-absolute" style={{bottom: '-30px', left: '20px'}}>
                  <img src="/img/profile.jpg" className="rounded-circle border border-3 border-white" alt="Profile" style={{width: '60px', height: '60px'}} />
                </div>
              </div>
              <div className="pt-4 mt-2">
                <h5>Adela Parkson</h5>
                <p className="text-muted small">Product Designer</p>
                <div className="d-flex justify-content-around text-center mt-4">
                  <div>
                    <h6>17</h6>
                    <small className="text-muted">Posts</small>
                  </div>
                  <div>
                    <h6>9.7k</h6>
                    <small className="text-muted">Followers</small>
                  </div>
                  <div>
                    <h6>274</h6>
                    <small className="text-muted">Following</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="bi bi-cloud fs-1 text-primary mb-3"></i>
              <h5>Your storage</h5>
              <p className="text-muted small">Supervise your drive space in the easiest way</p>
              <div className="progress mb-3">
                <div className="progress-bar w-75" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div>
              </div>
              <small className="text-muted">50 GB</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="bi bi-arrow-up-circle fs-1 text-primary mb-3"></i>
              <h5>Complete your profile</h5>
              <p className="text-muted small">Stay on the pulse of distributed projects with an angled whiteboard to plan, coordinate and discuss</p>
              <button className="btn btn-primary">Publish now</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>All Projects</h5>
              <p className="text-muted small">Here you can find more details about your projects. Keep you user engaged by providing meaningful information.</p>
              
              {projects.map(project => (
                <div key={project.id} className="d-flex align-items-center mb-3">
                  <img src={project.image} className="rounded me-3" alt={project.title} style={{width: '50px', height: '50px'}} />
                  <div>
                    <h6 className="mb-0">{project.title}</h6>
                    <small className="text-muted">Project #{project.id} · See project details</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>General Information</h5>
              <p className="text-muted small mb-4">As we live, our hearts turn colder. Cause pain is what we go through as we become older...</p>
              
              <h6 className="mb-3">Education</h6>
              <p className="mb-4">Stanford University</p>
              
              <h6 className="mb-3">Languages</h6>
              <p className="mb-4">English, Spanish, Italian</p>
              
              <h6 className="mb-3">Department</h6>
              <p className="mb-4">Product Design</p>
              
              <h6 className="mb-3">Work History</h6>
              <p className="mb-4">Google, Facebook</p>
              
              <h6 className="mb-3">Organization</h6>
              <p className="mb-4">Simmmple Web LLC</p>
              
              <h6 className="mb-3">Birthday</h6>
              <p>20 July 1986</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Notifications</h5>
                <i className="bi bi-three-dots"></i>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="itemUpdate" checked />
                <label className="form-check-label" htmlFor="itemUpdate">Item update notifications</label>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="itemComment" />
                <label className="form-check-label" htmlFor="itemComment">Item comment notifications</label>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="buyerReview" checked />
                <label className="form-check-label" htmlFor="buyerReview">Buyer review notifications</label>
              </div>
              
              {/* Add more notification switches as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;