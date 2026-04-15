export const GAS_URL = 'https://script.google.com/macros/s/AKfycbyU6gMR6gk--RQUK5FoyRk_X_Yo-2N0WdVWVdBbX_utH8DUgQRJ84fJli6bKkQKQBnF/exec';

export const gasApi = async (action: string, payload: any = {}) => {
  try {
    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify({ action, ...payload }));

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      redirect: 'follow'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`GAS API Error (${action}):`, error);
    return null;
  }
};
