import { useEffect, useState } from 'react'
import './App.css'

function App() {
	const [data, setData] = useState([])
	const [name, setName] = useState('')
	const [tag, setTag] = useState()
	const [difficulty, setDifficulty] = useState()
	const [status, setStatus] = useState()
	const [solution, setSolution] = useState()
	const [partiallySolution, setPartiallySolution] = useState()
	const [pagination, setPagination] = useState({
		size: 20,
		page: 1,
	})

	useEffect(() => {
		let url = `https://kep.uz/api/problems?page_size=${pagination.size}&page=${pagination.page}&title=${name}`

		if (difficulty) {
			url += `&difficulty=${difficulty}`
		} 

		fetch(url)
			.then(res => res.json())
			.then(res => {
				setData(res.data)
				setPagination({ ...pagination, total: res.pagesCount })
			})
	}, [pagination.page, pagination.size, name, difficulty, status])

	function prev() {
		if (pagination.page !== 1) {
			setPagination({ ...pagination, page: pagination.page - 1 })
		}
	}

	function next() {
		if (pagination.total > pagination.page) {
			setPagination({ ...pagination, page: pagination.page + 1 })
		}
	}

	function goToPage(number) {
		setPagination({ ...pagination, page: number })
	}

	function getPaginationRange() {
		let range = []

		if (pagination.total <= 5) {
			for (let i = 1; i <= pagination.total; i++) {
				range.push(i)
			}
		} else {
			if (pagination.page <= 3) {
				range = []
				for (let i = 1; i <= 5; i++) {
					range.push(i)
				}
			} else {
				if (pagination.page < 6) {
					range = []
					for (let i = 1; i <= pagination.page + 2; i++) {
						range.push(i)
					}
				} else {
					range = []
					for (let i = pagination.page - 2; i <= pagination.page + 2; i++) {
						range.push(i)
					}
				}
			}
		}

		return range
	}

	return (
		<div>
			<div>
				<input
					type='text'
					placeholder='nomi'
					onChange={e => setName(e.target.value)}
				/>
				<select onChange={e => setDifficulty(e.target.value)}>
					<option value={1}>Boshlangich</option>
					<option value={3}>Normal</option>
					<option value={6}>Qiyin</option>
				</select>
				<select onChange={e => setStatus(e.target.value)}>
					<option value={3}>Noaniq</option>
					<option value={1}>Ishlangan</option>
					<option value={2}>Ishlanmagan</option>
				</select>
			</div>
			<div>
				<table className='table' border={1}>
					<thead>
						<tr>
							<th>ID</th>
							<th>Nomi</th>
							<th>Teglar</th>
							<th>Qiyinchilik</th>
							<th>Reyting</th>
							<th>Urinishlar</th>
						</tr>
					</thead>
					<tbody>
						{data.map(item => (
							<tr>
								<td>{item.id}</td>
								<td>{item.title}</td>
								<td>
									{item.tags.map(tag => (
										<h5>{tag.name}</h5>
									))}
								</td>
								<td>{item.difficultyTitle}</td>
								<td>
									{item.likesCount} / {item.dislikesCount}
								</td>
								<td>
									{item.solved} / {item.attemptsCount}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='pagination'>
				<button onClick={prev}>&lt;</button>
				<ul>
					{pagination.page >= 6 && (
						<>
							<li onClick={() => goToPage(1)}>1</li>
							<li>...</li>
						</>
					)}
					{getPaginationRange().map(item => (
						<li
							onClick={() => goToPage(item)}
							className={item === pagination.page ? 'active' : ''}
						>
							{item}
						</li>
					))}
					{pagination.total > 5 && (
						<>
							<li>...</li>
							<li onClick={() => goToPage(pagination.total)}>
								{pagination.total}
							</li>
						</>
					)}
				</ul>
				<button onClick={next}>&gt;</button>
			</div>
			<div>
				<select
					onChange={e => setPagination({ ...pagination, size: e.target.value })}
				>
					<option value='10'>10/bet</option>
					<option value='20'>20/bet</option>
					<option value='50'>50/bet</option>
				</select>
			</div>
		</div>
	)
}

export default App
