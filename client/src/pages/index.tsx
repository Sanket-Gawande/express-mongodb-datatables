import Image from 'next/image'
import { Inter } from 'next/font/google'
import { json } from 'stream/consumers'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
export default function Home() {

  return (
    <main
      className='flex flex-col  justify-center min-h-screen py-12'
    >

      <section
        className='bg-white rounded-md text-left shadow-lg overflow-x-auto w-11/12 max-w-[600px] mx-auto mb-12'
      >
        {
          [

            {
              title: '1. Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.',
              link: 'one',
            },
            {
              title: '2. Male Users which have phone price greater than 10,000.',
              link: 'two',
            },
            {
              title: '3. Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.',
              link: 'three',
            },
            {
              title: '4. Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.',
              link: 'four',
            },
            {
              title: '5. Show the data of top 10 cities which have the highest number of users and their average income.',
              link: 'five',
            },

          ].map((item, index) => {
            return (
              <div
                className=''
                key={index}
              >

                <Link
                  className='text-blue-500'
                  href={`/table/${item.link}`}
                >
                  <p
                    className='text-sm font-medium py-2 px-6 text-left'
                  >{item.title}</p>
                </Link>
              </div>
            )
          })
        }

      </section>


    </main>
  )
}
