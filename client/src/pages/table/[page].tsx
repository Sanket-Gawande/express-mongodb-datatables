import Image from 'next/image'
import { Inter } from 'next/font/google'
import { json } from 'stream/consumers'

const inter = Inter({ subsets: ['latin'] })
interface DataType {
  id: number,
  first_name: string,
  last_name: string,
  email: string,
  gender: string,
  income: string,
  city: string,
  car: string,
  quote: string,
  phone_price: number,
}

export default function Home({ data, title }: { data: DataType[], title: string }) {

  return (
    <main
      className='flex flex-col  justify-center min-h-screen py-12'
    >
      <h4
        className=' overflow-x-auto w-11/12 mx-auto mb-4'
      >
        {title}
      </h4>
      <section
        className='bg-white text-left shadow-lg overflow-x-auto w-11/12 mx-auto mb-12'
      >
        <table
          className='min-w-[1000] w-full px-6'
        >
          <thead>
            <tr
              className='bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal'
            >
              <td
                className='py-3 px-6 text-left'
              >
                sr no
              </td>
              {
                data &&
                Object.keys(data[0]).map((key, index) => {
                  return (
                    <td
                      className='py-3 px-6 text-left'
                      key={index}>{key}</td>
                  )
                })

              }
            </tr>
          </thead>
          <tbody>
            {
              data &&

              data.map((item, index) => {
                return (
                  <tr key={index}
                    className='bg-white border-b border-gray-200 text-gray-600 text-sm even:bg-gray-50'
                  >
                    <td
                      className='py-2 px-6 text-left'
                    >{index + 1}</td>

                    {
                      Object.values(item).map((value, index) => {
                        return (
                          <td
                            className='py-2 px-6 text-left '
                            key={index}>{value}</td>
                        )

                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </section>


    </main>
  )
}

export async function getStaticProps({ params }: { params: { page: string } }) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${params.page}`)
  const titles = {
    one: '1. Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.',
    two: '2. Male Users which have phone price greater than 10, 000.',
    three: '3. Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/ her last name.',
    four: '4. Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.',
    five: '5. Show the data of top 10 cities which have the highest number of users and their average income.',
  } as { [key: string]: string }

  const data: any = await res.json()
  return {
    props: {
      data: data.data.map((i: { _id: any; __v: any }) => {
        delete i._id
        delete i.__v
        return i
      })
      ,
      title: titles[params.page]
    },
    revalidate: 60 * 5 //  5 minutes
  }
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { page: 'one', } },
      { params: { page: 'two' } },
      { params: { page: 'three' } },
      { params: { page: 'four' } },
      { params: { page: 'five' } },
    ],
    fallback: true
  }
}


// Path: client/src/pages/table/[page].tsx
