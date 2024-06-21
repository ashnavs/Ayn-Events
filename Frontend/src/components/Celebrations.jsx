import React from 'react'

function Celebrations() {
    return (
        <section className="py-12 bg-gray-100 text-center">
        <h3 className='text-xl mb-4 Acumin Pro Wide Medium'>Celebrations</h3>
          <h2 className="text-3xl font-bold mb-4">Modern, Detailed, Experiential</h2>
          <div className="flex justify-center space-x-4">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <img src="/src/assets/vendor2.jpg" alt="Celebration 1" className="rounded-lg mb-4" />
              <h3 className="text-xl font-semibold">Vendor 1</h3>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <img src="/src/assets/vendor2.jpg" alt="Celebration 2" className="rounded-lg mb-4" />
              <h3 className="text-xl font-semibold">Vendor 2</h3>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <img src="/src/assets/vendor2.jpg" alt="Celebration 3" className="rounded-lg mb-4" />
              <h3 className="text-xl font-semibold">Vendor 3</h3>
            </div>
          </div>
        </section>
      );
}

export default Celebrations
