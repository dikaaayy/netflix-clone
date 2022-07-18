import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Casts from '../../components/movieDetails/Casts'
import Details from '../../components/movieDetails/Details'
import RecommendationRow from '../../components/movieDetails/RecommendationRow'
import Navbar from '../../components/Navbar'

export const getServerSideProps = async (context: any) => {
  const { id } = context.params
  const { title } = context.query
  const movie = await fetch(
    'https://api.themoviedb.org/3/movie/' +
      id +
      '?api_key=76ebb98bc55f9ac730ad21ae0ef1a116'
  ).then((res) => res.json())

  if (
    (movie?.title || movie?.name || movie?.original_name) !== title ||
    !movie
  ) {
    return {
      redirect: {
        permanent: false,
        destination: `/tv/${id}?title=${encodeURIComponent(title)}`,
      },
    }
  }

  const casts = await fetch(
    'https://api.themoviedb.org/3/movie/' +
      id +
      '/credits?api_key=76ebb98bc55f9ac730ad21ae0ef1a116'
  ).then((res) => res.json())

  const recommendation = await fetch(
    'https://api.themoviedb.org/3/movie/' +
      id +
      '/recommendations?api_key=76ebb98bc55f9ac730ad21ae0ef1a116'
  ).then((res) => res.json())
  return {
    props: { movie, casts, recommendation },
  }
}

export default function Movies({ movie, casts, recommendation }: any) {
  const { cast } = casts
  console.log(movie)
  return (
    <>
      <Head>
        <title>{movie.name || movie.original_title} | Details </title>
        <link
          rel="icon"
          href="https://assets.nflxext.com/ffe/siteui/common/icons/nficon2016.ico"
        />
      </Head>
      <Navbar />
      <div className="relative h-[200vh] select-none bg-[#0a0a0a] font-netflixSans">
        <div
          className="absolute mb-5 h-[75vh] w-full bg-cover bg-center blur-md brightness-50 grayscale"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie?.backdrop_path})`,
          }}
        />
        <div className="absolute z-20 mx-10 mt-32 flex flex-col md:mx-48 md:flex-row md:space-x-10">
          {/*ratio gambar 5:8*/}
          <Image
            src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
            width={5 * 65}
            height={8 * 65}
            className="self-start rounded"
          />
          <div className="flex basis-full flex-col gap-y-8">
            <p className="text-2xl font-semibold text-white lg:text-5xl">
              {movie?.name || movie?.original_title}
            </p>
            <p className="text-base italic text-[#d4d4d4] lg:text-lg">
              {movie?.tagline}
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-white">Overview</p>
              <p className="text-lg text-white">{movie?.overview}</p>
            </div>
          </div>
        </div>
        <div className="mx-28 flex pt-[80vh] text-white">
          <div className="relative basis-3/4">
            <p className="mb-2 text-3xl font-semibold">Casts</p>
            <div className="flex w-[65vw] gap-x-3 overflow-x-auto">
              {cast.map((person: any, i: number) => {
                return <Casts person={person} key={i} />
              })}
            </div>
          </div>
          <div className="basis-1/4 pl-5">
            <Details movie={movie} />
          </div>
        </div>
        <div className="mx-[4.5rem] mt-28">
          <RecommendationRow
            title={'Similar Genre'}
            movies={recommendation.results}
          />
        </div>
      </div>
    </>
  )
}
