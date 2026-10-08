import numpy as np
import pandas as pd
import os

def generate_placement_dataset(n_samples=1500, random_state=42):
    """
    Generates a realistic student placement dataset based on real-world
    college placement criteria and statistical distributions.
    
    Features:
    - cgpa: Continuous (0.0 to 10.0)
    - tenth_percentage: Continuous (0.0 to 100.0)
    - twelfth_percentage: Continuous (0.0 to 100.0)
    - backlogs: Discrete (0, 1, 2, ...)
    - internships: Discrete (0, 1, 2, 3, 4)
    - projects: Discrete (0, 1, 2, 3, 4, 5)
    - coding_score: Continuous (0.0 to 100.0)
    - communication_score: Continuous (0.0 to 100.0)
    - aptitude_score: Continuous (0.0 to 100.0)
    - attendance: Continuous (0.0 to 100.0)
    - placement_status: Binary (0 = Not Placed, 1 = Placed)
    """
    np.random.seed(random_state)
    
    # 1. CGPA: Normal distribution centered at 7.4, truncated between 5.0 and 9.9
    cgpa = np.clip(np.random.normal(loc=7.4, scale=1.1, size=n_samples), 5.0, 9.9)
    cgpa = np.round(cgpa, 2)
    
    # 2. 10th and 12th percentage correlated with academic ability (CGPA)
    tenth = np.clip(cgpa * 9.2 + np.random.normal(loc=5.0, scale=7.0, size=n_samples), 52.0, 98.5)
    tenth = np.round(tenth, 1)
    
    twelfth = np.clip(cgpa * 8.8 + np.random.normal(loc=7.0, scale=8.0, size=n_samples), 50.0, 98.0)
    twelfth = np.round(twelfth, 1)
    
    # 3. Backlogs: Higher chance for lower CGPA
    backlog_probs = np.exp(-0.8 * (cgpa - 5.0))
    backlog_probs = np.clip(backlog_probs, 0.05, 0.8)
    backlogs = np.zeros(n_samples, dtype=int)
    for i in range(n_samples):
        if np.random.rand() < backlog_probs[i]:
            backlogs[i] = np.random.choice([1, 2, 3, 4], p=[0.55, 0.25, 0.15, 0.05])
            
    # 4. Internships: 0 to 4
    intern_lambda = 0.8 + 0.15 * (cgpa - 6.0)
    intern_lambda = np.clip(intern_lambda, 0.4, 2.5)
    internships = np.random.poisson(lam=intern_lambda, size=n_samples)
    internships = np.clip(internships, 0, 4)
    
    # 5. Projects: 0 to 5
    projects = np.random.choice([1, 2, 3, 4, 5], size=n_samples, p=[0.15, 0.35, 0.30, 0.15, 0.05])
    
    # 6. Coding / Technical Score: strongly related to projects, internships and personal aptitude
    coding_base = 35 + (cgpa - 5.0) * 6.5 + projects * 4.5 + internships * 5.0
    coding_score = np.clip(coding_base + np.random.normal(0, 10, size=n_samples), 30.0, 99.0)
    coding_score = np.round(coding_score, 1)
    
    # 7. Communication Score: normal distribution, slightly correlated with 10th/12th
    comm_base = 45 + (tenth / 100.0) * 20.0 + (twelfth / 100.0) * 15.0
    communication_score = np.clip(comm_base + np.random.normal(0, 9, size=n_samples), 35.0, 98.0)
    communication_score = np.round(communication_score, 1)
    
    # 8. Aptitude Score
    apt_base = 40 + (cgpa - 5.0) * 6.0 + (tenth / 100.0) * 18.0
    aptitude_score = np.clip(apt_base + np.random.normal(0, 8.5, size=n_samples), 35.0, 98.0)
    aptitude_score = np.round(aptitude_score, 1)
    
    # 9. Attendance: centered around 82%
    attendance = np.clip(np.random.normal(loc=82.0, scale=8.5, size=n_samples), 60.0, 99.0)
    attendance = np.round(attendance, 1)
    
    # 10. Placement Outcome formulation (multi-factorial, non-linear)
    # College placement drives rely heavily on:
    # - Coding score (weight ~0.30)
    # - CGPA (weight ~0.25)
    # - Aptitude & Communication (weight ~0.20)
    # - Internships & Projects (weight ~0.15)
    # - Strict penalty for backlogs (having >0 backlogs often disqualifies or hurts chances)
    
    z = (
        0.28 * ((coding_score - 50) / 18.0) +
        0.24 * ((cgpa - 7.0) / 1.2) +
        0.14 * ((aptitude_score - 60) / 15.0) +
        0.12 * ((communication_score - 65) / 14.0) +
        0.12 * (internships * 0.7 + projects * 0.3 - 1.2) +
        0.05 * ((attendance - 75) / 12.0) -
        0.55 * (backlogs > 0).astype(float) -
        0.30 * (backlogs > 1).astype(float)
    )
    
    # Sigmoid probability with controlled noise for realistic boundary overlap
    prob_placed = 1.0 / (1.0 + np.exp(-3.2 * z))
    
    # Realistic noise: 6% chance of company-specific variance (bad interview day or off-campus luck)
    random_noise = np.random.uniform(0, 1, size=n_samples)
    placement_status = (random_noise < prob_placed).astype(int)
    
    df = pd.DataFrame({
        'cgpa': cgpa,
        'tenth_percentage': tenth,
        'twelfth_percentage': twelfth,
        'backlogs': backlogs,
        'internships': internships,
        'projects': projects,
        'coding_score': coding_score,
        'communication_score': communication_score,
        'aptitude_score': aptitude_score,
        'attendance': attendance,
        'placement_status': placement_status
    })
    
    return df

if __name__ == '__main__':
    data_dir = os.path.join(os.path.dirname(__file__))
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, 'student_placement_data.csv')
    
    df = generate_placement_dataset(n_samples=1600, random_state=42)
    df.to_csv(csv_path, index=False)
    print(f"Generated realistic student placement dataset with {len(df)} records at {csv_path}")
    print(f"Placed count: {df['placement_status'].sum()} ({df['placement_status'].mean()*100:.1f}%)")
    print(f"Not Placed count: {len(df) - df['placement_status'].sum()}")
